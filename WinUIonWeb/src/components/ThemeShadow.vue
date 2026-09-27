<script lang="ts">
import { defineComponent, onBeforeUnmount } from 'vue'
import { createThemeShadow } from './themeShadowRuntime'
import type { XamlResourceFactoryContext } from './UICommandProperties'

export default Object.assign(defineComponent({
  name: 'ThemeShadow',
  inheritAttrs: false,
  setup(_, { expose }) {
    const shadow = createThemeShadow()
    expose(shadow)
    onBeforeUnmount(shadow.Dispose)
    return () => null
  }
}), {
  __xamlDependencyObject: true,
  __createXamlResource(_read: (name: string) => unknown, context: XamlResourceFactoryContext) {
    const shadow = createThemeShadow()
    context.Dispose(shadow.Dispose)
    return shadow
  }
})
</script>
