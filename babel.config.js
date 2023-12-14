module.exports = function(api) {
  api.cache(true); // Caches the computed config for faster rebuilds

  return {
    presets: ['babel-preset-expo'], // Use the Expo preset
    plugins: [
      'react-native-reanimated/plugin', // Include the reanimated plugin
      // ...other plugins
    ],
  };
};
