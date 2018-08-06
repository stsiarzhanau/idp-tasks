module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: 'current',
      },
      useBuiltIns: 'usage',
      debug: true,
      modules: false,
    }],
    '@babel/preset-stage-0',
  ],
}
