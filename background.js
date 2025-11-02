chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SEARCH_ALL") {
    const query = message.query || "";

    Promise.all([
      new Promise((resolve) => {
        chrome.history.search({ text: query, maxResults: 10, startTime: 0 }, (res) => resolve(res || []));
      }),
      new Promise((resolve) => {
        chrome.bookmarks.search(query, (res) => resolve(res || []));
      }),
      new Promise((resolve) => {
        chrome.tabs.query({}, (tabs) => {
          const filtered = tabs.filter(
            (t) => t.title?.toLowerCase().includes(query.toLowerCase())
          );
          resolve(filtered.slice(0, 10));
        });
      }),
    ]).then(([history, bookmarks, tabs]) => {
      sendResponse({ history, bookmarks, tabs });
    });

    return true; // async
  }
});
