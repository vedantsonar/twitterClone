import React from "react";
import { Link } from "react-router-dom";
import "../CSS Files/leftbar.css";
import homeImage from "../image/home-image.png";
import trendingImage from "../image/trending-image.png";
import searchImage from "../image/search-image.png";
import createPostImage from "../image/createPost-image.png";
import bookmarkImage from "../image/bookmark-image.png";
import settingImage from "../image/setting-image.png";

// TODO: home -> feed (active)

function LeftBar() {
  return (
    <div className="width-left border-end border-0 margin-top1 fixed">
      <div className="list-group" id="list-tab" role="tablist">
        <Link
          className="flex-for-icon list-group-item border-0 list-group-item-action my-3 border-radius list-item-width"
          id="list-home-list"
          to="/"
          role="tab"
          aria-controls="list-home"
        >
          <img className="left-icon" src={homeImage} alt="home-image" />
          <h5 className="text-hide bold-none">Home</h5>
        </Link>
        <Link
          className="flex-for-icon list-group-item border-0 list-group-item-action my-3 border-radius list-item-width"
          id="list-trending-list"
          to="/trending" // Use appropriate route
          role="tab"
          aria-controls="list-trending"
        >
          <img className="left-icon" src={trendingImage} alt="trending-image" />
          <h5 className="text-hide bold-none">Trending</h5>
        </Link>
        <Link
          className="flex-for-icon list-group-item border-0 list-group-item-action my-3 border-radius list-item-width"
          id="list-search-list"
          to="/search"
          role="tab"
          aria-controls="list-search"
        >
          <img className="left-icon" src={searchImage} alt="search-image" />
          <h5 className="text-hide bold-none">Search</h5>
        </Link>
        <Link
          className="flex-for-icon list-group-item border-0 list-group-item-action my-3 border-radius list-item-width"
          id="list-create-post-list"
          to="/create-post" // Use appropriate route
          role="tab"
          aria-controls="list-create-post"
        >
          <img className="left-icon" src={createPostImage} alt="create post-image" />
          <h5 className="text-hide bold-none">Create Post</h5>
        </Link>
        <Link
          className="flex-for-icon list-group-item border-0 list-group-item-action my-3 border-radius list-item-width"
          id="list-bookmark-list"
          to="/bookmark" // Use appropriate route
          role="tab"
          aria-controls="list-bookmark"
        >
          <img className="left-icon" src={bookmarkImage} alt="bookmark-image" />
          <h5 className="text-hide bold-none">Bookmark</h5>
        </Link>
        <Link
          className="flex-for-icon list-group-item border-0 list-group-item-action my-3 border-radius list-item-width"
          id="list-setting-list"
          to="/settings" // Use appropriate route
          role="tab"
          aria-controls="list-setting"
        >
          <img className="left-icon" src={settingImage} alt="setting-image" />
          <h5 className="text-hide bold-none">Setting</h5>
        </Link>
      </div>
    </div>
  );
}

export default LeftBar;
