import React, { useEffect, useState } from 'react'
import { withRef } from '@udecode/cn'
import { PlateElement } from '@udecode/plate-common'
import { useMermaidElement } from '../../hooks/use-mermaid-element'
import { Moon, PencilIcon, SunMoon } from 'lucide-react'
import { CodeBlock } from '../../plugins/ui/code-block'
import { ELEMENT_MERMAID } from '../../plugins/custom/mermaid-plugin'

const LightModeComponent = ({ onToggleMode }) => {
  const [isLightMode, setIsLightMode] = useState(false)

  const handleToggle = (e) => {
    e.preventDefault()
    setIsLightMode((prevMode) => !prevMode)
  }

  useEffect(() => {
    //? Note: Adding this class on a <pre/> will remove its base bg styling
    const modeClass = isLightMode ? 'not-tina-prose' : ''
    if (onToggleMode) {
      onToggleMode(modeClass)
    }
  }, [isLightMode, onToggleMode])

  return (
    <div>
      <button
        type="button"
        onClick={handleToggle}
        className="flex items-center w-5 h-5 text-gray-500 cursor-pointer"
      >
        {isLightMode ? <Moon /> : <SunMoon />}
      </button>
    </div>
  )
}

const MermaidElementWithRef = ({ config, lightMode }) => {
  const { mermaidRef } = useMermaidElement()
  return (
    <div contentEditable={false}>
      <div ref={mermaidRef}>
        <pre className={`${lightMode} mermaid`}>{config}</pre>
      </div>
    </div>
  )
}

export const MermaidElement = withRef<typeof PlateElement>(
  ({ children, nodeProps, element, ...props }, ref) => {
    const [isEditing, setIsEditing] = React.useState(false)
    const [lightModeClass, setLightModeClass] = React.useState('')
    const [mermaidConfig, setMermaidConfig] = React.useState(
      element.value || ''
    )

    const node = {
      type: ELEMENT_MERMAID,
      value: mermaidConfig,
      children: [{ type: 'text', text: '' }],
    }

    return (
      <PlateElement element={element} ref={ref} {...props}>
        <div className="relative">
          <div className="absolute top-2 right-2 z-10 space-y-2">
            <PencilIcon
              className="w-5 h-5 text-gray-500 cursor-pointer"
              onClick={() => {
                setIsEditing(!isEditing)
              }}
            />
            <LightModeComponent onToggleMode={(v) => setLightModeClass(v)} />
          </div>
          {isEditing ? (
            <CodeBlock
              children={''}
              language="yaml"
              {...props}
              element={node}
              onChangeCallback={(value) => setMermaidConfig(value)}
            />
          ) : (
            <MermaidElementWithRef
              config={mermaidConfig}
              lightMode={lightModeClass}
            />
          )}
          {children}
        </div>
      </PlateElement>
    )
  }
)
