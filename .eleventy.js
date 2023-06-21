const { DateTime } = require("luxon");

const UglifyJS = require("uglify-es");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const svgContents = require("eleventy-plugin-svg-contents");
const Image = require("@11ty/eleventy-img");
const readingTime = require('eleventy-plugin-reading-time');


async function imageShortcode(src, alt, sizes, cls = '') {
  let metadata = await Image(src, {
    widths: [300, 900],
    formats: ["avif", "webp", "jpeg"],
    outputDir: "./dist/img",
  });
  let imageAttributes = {
    alt,
    sizes,
    class: cls,
    loading: "lazy",
    decoding: "async",
  };
  return Image.generateHTML(metadata, imageAttributes, {
    whitespaceMode: "inline"
  });
}


module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(svgContents);
  eleventyConfig.addWatchTarget("src/_includes/assets/sass/");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("src/includes/assets/");
  eleventyConfig.addPassthroughCopy("src/img/");
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(readingTime);
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  eleventyConfig.addLiquidShortcode("image", imageShortcode);
  eleventyConfig.addJavaScriptFunction("image", imageShortcode);
  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.addFilter("showcased", arr => { let showcase = p => p.date.showcased; return arr.filter(showcase); });
  eleventyConfig.addFilter("readableDate", dateObj => { return DateTime.fromJSDate(dateObj).toFormat("LLL dd yyyy"); });
  eleventyConfig.addFilter("machineDate", dateObj => { return DateTime.fromJSDate(dateObj).toFormat("yyyy-MM-dd"); });
  let markdownIt = require("markdown-it");
  let markdownItAnchor = require("markdown-it-anchor");
  let options = { html: true, breaks: true, linkify: true };
  let opts = { permalink: false };
  eleventyConfig.setLibrary("md", markdownIt(options).use(markdownItAnchor, opts));
  eleventyConfig.addCollection("featuredProjects", function (collectionApi) {
    return collectionApi.getFilteredByTags("project", "featured");
  });
  eleventyConfig.addCollection("featuredArticles", function (collectionApi) {
    return collectionApi.getFilteredByTags("post", "featured");
  });
  return {
    templateFormats: ["md", "njk", "html", "liquid", "css"],
    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    passthroughFileCopy: true,
    dir: {
      input: "src",
      output: "dist",
    },
  };
};