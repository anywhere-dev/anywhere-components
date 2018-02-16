import React, { Component } from 'react'

import { Paper, Grid, Tabs, Tab, Button, IconButton, Table, TableHead, TableRow, TableCell, TableBody, Menu, MenuItem, Hidden, Modal, Typography } from 'material-ui'
import ExpansionPanel, {
    ExpansionPanelSummary,
    ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel'
import { withStyles } from 'material-ui/styles'

import { MoreHoriz as MoreHorizIcon, ExpandMore as ExpandMoreIcon } from 'material-ui-icons'

const styles = theme => ({
    title: {
    },
    buttons: {
    },
    filterModal: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    filterModalBody: {
        width: '100%',
        maxWidth: theme.spacing.unit * 100,
        maxHeight: theme.spacing.unit * 50,
        padding: theme.spacing.unit * 2,
        outline: 'none'
    }
})

const actionsMenuStyles = theme => ({
    menu: {
        minWidth: '150px'
    },
    menuItem: {
        minWidth: '150px'
    }
})

const ActionsMenu = withStyles(actionsMenuStyles)(({ classes, actions = [], anchorEl, onClose, currentRow = {} }) => {
    return (
        <Menu className={classes.menu} anchorEl={anchorEl} open={!!anchorEl} onClose={onClose}>
            {actions.map(({ allowAction, action, description }, index) => {
                return (
                    <MenuItem key={index} className={classes.menuItem} disabled={allowAction ? !allowAction(currentRow) : false} onClick={() => action(currentRow)}>{description}</MenuItem>
                )
            })}
        </Menu>
    )
})

class CRUDTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentRowForActionsMenu: {},
            anchorElForActionsMenu: null,
            showFilter: false
        }
        this.handleActionsButtonClick = this.handleActionsButtonClick.bind(this)
        this.closeActionsMenu = this.closeActionsMenu.bind(this)
        this.renderTableHeader = this.renderTableHeader.bind(this)
        this.renderTableBody = this.renderTableBody.bind(this)
        this.renderMobileList = this.renderMobileList.bind(this)
        this.allowAdd = this.allowAdd.bind(this)
        this.allowFilter = this.allowFilter.bind(this)
        this.toggleFilter = this.toggleFilter.bind(this)
        this.renderFilter = this.renderFilter.bind(this)
    }

    handleActionsButtonClick(event, row) {
        this.setState({
            anchorElForActionsMenu: event.currentTarget,
            currentRowForActionsMenu: row
        })
    }

    closeActionsMenu(row) {
        this.setState({
            anchorElForActionsMenu: null,
            currentRowForActionsMenu: {}
        })
    }

    renderTableHeader() {
        const { columns, actions } = this.props
        return (
            <TableHead>
                <TableRow>
                    {columns.map(column => <TableCell key={column.name}>{column.description}</TableCell>)}
                    {actions ? <TableCell>Ações</TableCell> : ''}
                </TableRow>
            </TableHead>
        )
    }

    renderTableBody() {
        const { columns, rows, actions } = this.props
        return (
            <TableBody>
                {rows.map(row => {
                    return (
                        <TableRow hover key={row.id}>
                            {columns.map(column => {
                                return <TableCell key={column.name}>{column.formatter ? column.formatter(row[column.name]) : row[column.name]}</TableCell>
                            })}
                            {actions ? <TableCell><IconButton ><MoreHorizIcon onClick={(event) => this.handleActionsButtonClick.call(this, event, row)} /></IconButton></TableCell> : ''}
                        </TableRow>
                    )
                })}
            </TableBody>
        )
    }

    renderMobileList() {
        const { columns, rows, actions } = this.props
        return (
            rows.map(row => {
                return (
                    <ExpansionPanel key={row.id}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <h3> {row[columns[0].name]} - {row[columns[1].name]}</h3>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Grid container>
                                {columns.map((column) => {
                                    return (
                                        <Grid key={column.name} item xs={12}>
                                            <p><b>{column.description}</b>: {column.formatter ? column.formatter(row[column.name]) : row[column.name]}</p>
                                        </Grid>
                                    )
                                })}
                                {actions ? <IconButton onClick={(event) => this.handleActionsButtonClick.call(this, event, row)} ><MoreHorizIcon /></IconButton> : ''}
                            </Grid>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                )
            })
        )
    }

    renderMobileRow(row) {

    }

    allowAdd() {
        const { allowAdd, onAdd } = this.props
        if (!onAdd) return false
        if (allowAdd && !allowAdd()) {
            return false
        }

        return true
    }

    allowFilter() {
        const { Filter } = this.props
        return !!Filter
    }

    toggleFilter() {
        const { showFilter } = this.state
        this.setState({
            showFilter: !showFilter
        })
    }

    renderFilter() {
        const { showFilter } = this.state
        const { classes, Filter } = this.props
        if (!Filter) return null
        return (
            <Modal className={classes.filterModal} open={showFilter} onClose={this.toggleFilter}>
                <Paper className={classes.filterModalBody}>
                    <Filter toggleFilter={this.toggleFilter} />
                </Paper>
            </Modal>
        )
    }

    render() {
        const { anchorElForActionsMenu, currentRowForActionsMenu } = this.state
        const { classes, title, columns, rows, onAddRow, onRowClick, actions, onAdd, filter } = this.props
        return (
            <Grid container>
                <Grid item xs={12} className={classes.title}>
                    <Grid container>
                        <Grid item xs={12} md={8}>
                            <Typography variant="title">{title}</Typography>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Button fullWidth disabled={!this.allowAdd()} onClick={onAdd} variant="raised" color="primary">Adicionar</Button>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Button fullWidth disabled={!this.allowFilter()} variant="flat" onClick={this.toggleFilter}>Filtro</Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container>
                        <Hidden smDown>
                            <Grid item xs={12}>
                                <Table>
                                    {this.renderTableHeader()}
                                    {this.renderTableBody()}
                                </Table>
                            </Grid>
                        </Hidden>
                        <Hidden mdUp>
                            <Grid item xs={12}>
                                {this.renderMobileList()}
                            </Grid>
                        </Hidden>
                    </Grid>
                </Grid>
                <ActionsMenu actions={actions} onClose={this.closeActionsMenu} anchorEl={anchorElForActionsMenu} currentRow={currentRowForActionsMenu} />
                {this.renderFilter()}
            </Grid>)
    }

}

export default withStyles(styles)(CRUDTable)