import React, { useEffect, useState } from 'react'
import { MultiSelect, MultiSelectProps } from "@mantine/core";
import { WaterbodyClassifications } from "../../../types/Waterbody";

type SelectOption = {
    value: WaterbodyClassifications,
    label: string
}

const data: SelectOption[] = [
    { value: 'bay', label: "Bay" },
    { value: 'bayou', label: 'Bayou' },
    { value: 'beach', label: 'Beach' },
    { value: 'creek', label: 'Creek' },
    { value: 'harbor', label: 'Harbor' },
    { value: 'lagoon', label: 'Lagoon' },
    { value: 'lake', label: 'Lake' },
    { value: 'marsh', label: "Marsh" },
    { value: 'oxbow', label: 'Oxbow' },
    { value: 'pond', label:  'Pond' },
    { value: 'reservoir', label: 'Reservoir' },
    { value: 'river', label: 'River' },
    { value: 'slough', label: 'Slough'},
    { value: 'strait', label: 'Strait'},
    { value: 'stream', label: 'Stream'},
    { value: 'unknown', label: 'Other' }
]


type Props = {
    setClassifications: (values: string[]) => void 
    MultiSelectProps?: Omit<MultiSelectProps, 'data'>
}

const WaterbodyClassificationSelect = ({ 
    setClassifications, 
    MultiSelectProps
}: Props): JSX.Element => {

    const [values, setValues] = useState<string[]>([])

    useEffect(() => {
        if(values) setClassifications(values)
    }, [values])

    return (
        <MultiSelect
            size='xs' searchable
            style={{ width: '100%' }}
            styles={{ defaultVariant: { backgroundColor: 'rgba(255,255,255,.7)'}}}
            data={data} 
            value={values} 
            onChange={setValues}
            placeholder='Filter by classification'
            { ...MultiSelectProps }
        />
    )
}

export default WaterbodyClassificationSelect;