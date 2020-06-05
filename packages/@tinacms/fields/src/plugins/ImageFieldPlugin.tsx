/**

Copyright 2019 Forestry.io Inc

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

import * as React from 'react'
import { wrapFieldsWithMeta } from './wrapFieldWithMeta'
import { InputProps, ImageUpload } from '../components'
import { useCMS } from '@tinacms/react-core'
import { parse } from './textFormat'
import { useState, useEffect } from 'react'

type FieldProps = any
interface ImageProps {
  path: string
  previewSrc(form: any, field: FieldProps): string | Promise<string>
  uploadDir(form: any): string
  clearable?: boolean // defaults to true
}

export const ImageField = wrapFieldsWithMeta<InputProps, ImageProps>(props => {
  const cms = useCMS()

  const [srcIsLoading, setSrcIsLoading] = useState(true)
  const [src, setSrc] = useState('')
  useEffect(() => {
    ;(async () => {
      setSrcIsLoading(true)
      let imageSrc = ''
      try {
        imageSrc = await props.field.previewSrc(
          props.form.getState().values,
          props
        )
      } catch (e) {
        // @ts-ignore cms.alerts
        cms.alerts.error(
          `Failed to generate preview for '${props.field.name}': ${e.message}`
        )
      }
      setSrc(imageSrc)

      setSrcIsLoading(false)
    })()
  }, [props.input.value])

  return (
    <ImageUpload
      value={props.input.value}
      previewSrc={src}
      loading={srcIsLoading}
      onDrop={async ([file]: File[]) => {
        const directory = props.field.uploadDir(props.form.getState().values)
        // @ts-ignore cms.media
        const [media] = await cms.media.store.persist([
          {
            directory,
            file,
          },
        ])
        if (media) {
          props.input.onChange(media.filename)
        } else {
          // TODO Handle failure
        }
      }}
      onClear={
        props.field.clearable === false
          ? undefined
          : () => {
              props.input.onChange('')
            }
      }
    />
  )
})

export const ImageFieldPlugin = {
  name: 'image',
  Component: ImageField,
  parse,
}
