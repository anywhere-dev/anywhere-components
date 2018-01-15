import React, { Component, Fragment } from 'react'
import { Table, Button, Header, Segment, Modal, Form, Dimmer, Dropdown } from 'semantic-ui-react'


class CRUDTable extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showFilter: false,
            filterValues: {}
        }
    }

    renderFilter() {
        const { showFilter, filterValues } = this.state
        const { columns } = this.props
        return (
            <Modal open={showFilter}>
                <Modal.Header>Filtro</Modal.Header>
                <Modal.Content>
                    <Form>
                        {columns.map(column => {
                            if (column.filter) {
                                return <Form.Input label={column.description} value={filterValues[column.name]} onChange={(e) => {
                                    filterValues[column.name] = e.target.value
                                    this.setState({
                                        filterValues
                                    })
                                }} />
                            }
                        })}
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button icon="filter" onClick={this.onFilter.bind(this)}>Filtrar</Button>
                </Modal.Actions>
            </Modal>
        )
    }

    onFilter() {
        const { filterValues } = this.state
        const { onFilter } = this.props
        this.setState({ showFilter: false })
        if (onFilter) onFilter(filterValues)
    }

    renderCRUDButtons() {
        const { onAdd, allowAdd } = this.props
        return (
            <Button primary content="Adicionar" disabled={allowAdd ? !allowAdd() : false} onClick={onAdd} />
        )
    }

    onRowClick(row) {
        const { onRowClick } = this.props
        if (onRowClick) {
            onRowClick(row)
        }
    }


    render() {
        const { columns, rows, onAddRow, onRowClick, actions } = this.props
        return (
            <div>
                <div className="crud-table">
                    <div className="crud-table__buttons">
                        <Button icon="filter" onClick={() => this.setState({ showFilter: true })} disabled={!columns.filter(column => column.filter).length} />
                        {this.renderFilter.call(this)}
                        {this.renderCRUDButtons.call(this)}
                    </div>
                    <div className="crud-table__table">
                        <Table celled selectable={!!onRowClick}>
                            <Table.Header>
                                <Table.Row>
                                    {columns.map(column => <Table.HeaderCell key={column.name}>{column.description}</Table.HeaderCell>)}
                                    {actions ? <Table.HeaderCell>Ações</Table.HeaderCell> : ''}
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {rows.map(row => {
                                    return (
                                        <Table.Row key={row.id} onClick={() => this.onRowClick.call(this, row)}>
                                            {columns.map(column => {
                                                return <Table.Cell key={column.name}>{column.formatter ? column.formatter(row[column.name]) : row[column.name]}</Table.Cell>
                                            })}
                                            {actions ? <Table.Cell>
                                                <Dropdown text="Ação">
                                                    <Dropdown.Menu>
                                                        {actions.map(({allowAction, action, description }) => <Dropdown.Item disabled={allowAction ? !allowAction(row) : false} onClick={() => action(row)}>{description}</Dropdown.Item>)}
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </Table.Cell> : ''}
                                        </Table.Row>
                                    )
                                })}
                            </Table.Body>
                        </Table>
                    </div>
                </div>
                <style jsx>{`
                    .crud-table{
                        display: flex;
                        flex-direction: column;
                    }

                    .crud-table__buttons{
                        padding - top: 8px;
                        padding-bottom: 8px;
                    }
                    `}
                </style>
            </div>
        )
    }
}

export default CRUDTable