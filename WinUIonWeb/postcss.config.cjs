const selectorParser = require('postcss-selector-parser')
const hoverGuard = ':where(:not(.winui-touch-input *))'

// A browser may retain :hover after a touch tap. Gate only hover selectors;
// the explicit Pressed and Selected states stay available to touch users.
const touchHover = {
  postcssPlugin: 'winui-touch-hover',
  Rule(rule) {
    const file = rule.source?.input.file || ''
    if (!/[\\/]src[\\/](?:components|gallery|styles)[\\/]/.test(file) || !rule.selector.includes(':hover')) return
    rule.selector = selectorParser(selectors => {
      selectors.walkPseudos(pseudo => {
        if (pseudo.value === ':hover' && pseudo.next()?.toString() !== hoverGuard) {
          pseudo.parent.insertAfter(pseudo, selectorParser().astSync(hoverGuard).first.first)
        }
      })
    }).processSync(rule.selector)
  }
}

module.exports = { plugins: [touchHover] }
