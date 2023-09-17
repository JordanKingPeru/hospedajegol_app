import { Input } from '@nextui-org/input'
import { type } from 'os'

interface InputElementProps {
  label: string
  type: string
  key: string
  valueDocId: string
  setValueDocId: (value: string) => void
  isInvalid: boolean
}

const InputElement: React.FC<InputElementProps> = ({
  label,
  type,
  key,
  valueDocId,
  setValueDocId,
  isInvalid
}) => {
  return (
    <>
      <Input
        isClearable
        labelPlacement='outside'
        radius='sm'
        variant='faded'
        autoComplete='on'
        label={label}
        type={type}
        key={key}
        value={valueDocId}
        description={valueDocId}
        isInvalid={isInvalid}
        color={
          valueDocId && isInvalid
            ? 'danger'
            : valueDocId && !isInvalid
            ? 'success'
            : undefined
        }
        errorMessage={isInvalid ? 'Please enter a valid DNI' : ''}
        onClear={() => console.log('input cleared')}
        onValueChange={setValueDocId}
        classNames={{
          input: ['border-0', 'focus:outline-none', 'focus:ring-0']
        }}
      />
      <p className='text-small text-default-500'>Input value: {valueDocId}</p>
    </>
  )
}

export default InputElement
