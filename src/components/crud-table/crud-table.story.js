import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'

import CRUDTable from './'

const columns = [{name: 'id', description: 'Id', filter: true},{ name: 'fullName', description: 'Nome Completo', filter: true }, { name: 'age', description: 'Idade' }, { name: 'profession', description: 'Profissão', filter: true }]
const rows = [
    { id: 1, fullName: 'Matheus Blödorn Claudino', age: 18, profession: 'Programador' },
    { id: 2, fullName: 'Anna Giulia Yahia', age: 17, profession: 'Estudante' }
]

storiesOf('CRUD Table', module)
    .add('default', () => <CRUDTable
        title="Pessoas  "
        columns={columns}
        rows={rows}
        onRowClick={action('onRowClick')}
        onAdd={action('onAdd')}
        allowAdd={action('allowAdd')}
        onFilter={action('onFilter')}
    />)
