const { DateTime } = require("luxon");
const CleanCSS = require("clean-css");
const UglifyJS = require("uglify-es");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const Image = require("@11ty/eleventy-img");

async function imageShortcode(src, alt, sizes, cls = '') {
  let metadata = await Image(src, {
    widths: [300, 600],
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

  eleventyConfig.addWatchTarget("src/_includes/assets/sass/");
  eleventyConfig.addPassthroughCopy("_admin");
  eleventyConfig.addPassthroughCopy("src/includes/assets/");
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  eleventyConfig.addLiquidShortcode("image", imageShortcode);
  eleventyConfig.addJavaScriptFunction("image", imageShortcode);
  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.addFilter("readableDate", dateObj => { return DateTime.fromJSDate(dateObj).toFormat("dd LLL yyyy"); });
  eleventyConfig.addFilter("machineDate", dateObj => { return DateTime.fromJSDate(dateObj).toFormat("yyyy-MM-dd"); });
  eleventyConfig.addFilter("cssmin", function (code) { return new CleanCSS({}).minify(code).styles; });
  eleventyConfig.addFilter("jsmin", function (code) {
    let minified = UglifyJS.minify(code);
    if (minified.error) {
      console.log("UglifyJS error: ", minified.error);
      return code;
    }
    return minified.code;
  });
  eleventyConfig.addCollection("authors", collection => {
    const blogs = collection.getFilteredByGlob("posts/*.md");
    return blogs.reduce((coll, post) => {
      const author = post.data.author;
      if (!author) {
        return coll;
      }
      if (!coll.hasOwnProperty(author)) {
        coll[author] = [];
      }
      coll[author].push(post.data);
      return coll;
    }, {});
  });
  let markdownIt = require("markdown-it");
  let markdownItAnchor = require("markdown-it-anchor");
  let options = { html: true, breaks: true, linkify: true };
  let opts = { permalink: false };
  eleventyConfig.setLibrary("md", markdownIt(options).use(markdownItAnchor, opts));
  return {
    templateFormats: ["md", "njk", "html", "liquid", "css"],
    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    passthroughFileCopy: true,
    dir: {
      input: "src",
      output: "dist"
    }
  };
};
