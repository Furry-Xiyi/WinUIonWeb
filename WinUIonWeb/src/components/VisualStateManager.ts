import { defineComponent } from 'vue'

const marker = (name: string) => defineComponent({ name, setup: () => () => null })

export const VisualStateGroup = marker('VisualStateGroup')
export const VisualState = Object.assign(marker('VisualState'), {
  Setters: marker('VisualState.Setters')
})

export interface VisualStateControl {
  GoToState: (stateName: string, useTransitions?: boolean) => boolean;
}

export const VisualStateManager = {
  VisualStateGroups: marker('VisualStateManager.VisualStateGroups'),
  GoToState(control: VisualStateControl | null | undefined, stateName: string, useTransitions: boolean): boolean {
    return control?.GoToState?.(stateName, useTransitions) ?? false
  }
}
