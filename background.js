chrome.runtime.onInstalled.addListener(() => {
  // Allow content scripts to read/write session storage
  chrome.storage.session.setAccessLevel({
    accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS'
  });
});
