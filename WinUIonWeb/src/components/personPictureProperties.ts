import { defineComponent, Fragment, h, inject, provide, type InjectionKey } from 'vue'
import { imageSourceContextKey, type ImageSourceRegistration } from './imageSource'

type PersonPictureSourceName = 'ProfilePicture' | 'BadgeImageSource'
export const personPictureSourceKey: InjectionKey<{
  register: (name: PersonPictureSourceName, source: ImageSourceRegistration | null) => void
}> = Symbol('winui-person-picture-image-source')

const sourceProperty = (name: PersonPictureSourceName) => defineComponent({
  name: `PersonPicture.${name}`,
  __personPictureSourceProperty: name,
  setup(_, { slots }) {
    const owner = inject(personPictureSourceKey, null)
    provide(imageSourceContextKey, source => owner?.register(name, source))
    return () => h(Fragment, slots.default?.())
  }
})

export const PersonPictureProfilePicture = sourceProperty('ProfilePicture')
export const PersonPictureBadgeImageSource = sourceProperty('BadgeImageSource')
