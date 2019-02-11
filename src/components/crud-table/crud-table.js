import React, { Component, Fragment } from "react";

import {
  Paper,
  Grid,
  Tooltip,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Menu,
  MenuItem,
  Hidden,
  Modal,
  Typography,
  Button,
  LinearProgress
} from "material-ui";
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from "material-ui/ExpansionPanel";
import { withStyles } from "material-ui/styles";

import {
  MoreHoriz as MoreHorizIcon,
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  FilterList as FilterListIcon
} from "material-ui-icons";

import { JssProvider } from "react-jss";

import { createGenerateClassName } from "react-jss";

const generateClassName = createGenerateClassName();

const styles = theme => ({
  title: {},
  buttons: {},
  filterModal: {
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  titleContainer: {
    display: "flex",
    alignItems: "center"
  },
  fabContainer: {
    padding: theme.spacing.unit,
    display: "flex",
    justifyContent: "flex-end"
  },
  fab: {
    padding: theme.spacing.unit
  },
  filterModalBody: {
    width: "100%",
    maxWidth: theme.spacing.unit * 100,
    padding: theme.spacing.unit * 2,
    outline: "none"
  }
});

const actionsMenuStyles = theme => ({
  menu: {
    minWidth: "150px"
  },
  menuItem: {
    minWidth: "150px"
  }
});

const ActionsMenu = withStyles(actionsMenuStyles)(
  ({ classes, actions = [], anchorEl, onClose, currentRow = {} }) => {
    return (
      <Menu
        className={classes.menu}
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={onClose}
      >
        {actions.map(({ allowAction, action, description }, index) => {
          return (
            <MenuItem
              key={index}
              className={classes.menuItem}
              disabled={allowAction ? !allowAction(currentRow) : false}
              onClick={() => {
                action(currentRow);
                onClose();
              }}
            >
              {description}
            </MenuItem>
          );
        })}
      </Menu>
    );
  }
);

class CRUDTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentRowForActionsMenu: {},
      anchorElForActionsMenu: null,
      showFilter: false
    };
    this.handleActionsButtonClick = this.handleActionsButtonClick.bind(this);
    this.closeActionsMenu = this.closeActionsMenu.bind(this);
    this.renderTableHeader = this.renderTableHeader.bind(this);
    this.renderTableBody = this.renderTableBody.bind(this);
    this.renderMobileList = this.renderMobileList.bind(this);
    this.allowAdd = this.allowAdd.bind(this);
    this.allowFilter = this.allowFilter.bind(this);
    this.toggleFilter = this.toggleFilter.bind(this);
    this.renderFilter = this.renderFilter.bind(this);
    this.renderActionButtons = this.renderActionButtons.bind(this);
    this.renderTitle = this.renderTitle.bind(this);
  }

  handleActionsButtonClick(event, row) {
    this.setState({
      anchorElForActionsMenu: event.currentTarget,
      currentRowForActionsMenu: row
    });
  }

  closeActionsMenu(row) {
    this.setState({
      anchorElForActionsMenu: null,
      currentRowForActionsMenu: {}
    });
  }

  renderTableHeader() {
    const { columns, actions } = this.props;
    return (
      <TableHead>
        <TableRow>
          {columns.map(column => (
            <TableCell key={column.name}>{column.description}</TableCell>
          ))}
          {actions && actions.length ? <TableCell>Ações</TableCell> : ""}
        </TableRow>
      </TableHead>
    );
  }

  renderTableBody() {
    const { columns, rows, actions, loading } = this.props;
    return (
      <TableBody>
        {rows.map(row => {
          return (
            <TableRow hover key={row.id}>
              {columns.map(column => {
                if (column.name.includes(".")) {
                  const subsections = column.name.split(".");
                  row[column.name] = subsections.reduce(
                    (lastValue, currentValue, index) => {
                      if (!lastValue) return "";
                      return lastValue[subsections[index]];
                    },
                    row
                  );
                }
                return (
                  <TableCell key={column.name}>
                    {column.formatter
                      ? column.formatter(row[column.name], row)
                      : row[column.name]}
                  </TableCell>
                );
              })}
              {actions && actions.length ? (
                <TableCell>
                  <IconButton disabled={loading}>
                    <MoreHorizIcon
                      onClick={event =>
                        this.handleActionsButtonClick.call(this, event, row)
                      }
                    />
                  </IconButton>
                </TableCell>
              ) : (
                ""
              )}
            </TableRow>
          );
        })}
      </TableBody>
    );
  }

  renderMobileList() {
    const { columns, rows, actions } = this.props;
    return rows.map(row => {
      return (
        <ExpansionPanel key={row.id}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <h3>
              {row[columns[0].name]} - {row[columns[1].name]}
            </h3>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid container>
              {columns.map(column => {
                if (column.name.includes(".")) {
                  const subsections = column.name.split(".");
                  row[column.name] = subsections.reduce(
                    (lastValue, currentValue, index) => {
                      if (!lastValue) return "";
                      return lastValue[subsections[index]];
                    },
                    row
                  );
                }
                return (
                  <Grid key={column.name} item xs={12}>
                    <p>
                      <b>{column.description}</b>:{" "}
                      {column.formatter
                        ? column.formatter(row[column.name], row)
                        : row[column.name]}
                    </p>
                  </Grid>
                );
              })}
              {actions ? (
                <IconButton
                  onClick={event =>
                    this.handleActionsButtonClick.call(this, event, row)
                  }
                >
                  <MoreHorizIcon />
                </IconButton>
              ) : (
                ""
              )}
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      );
    });
  }

  renderMobileRow(row) {}

  allowAdd() {
    const { allowAdd, onAdd } = this.props;
    if (!onAdd) return false;
    if (allowAdd && !allowAdd()) {
      return false;
    }

    return true;
  }

  allowFilter() {
    const { Filter } = this.props;
    return !!Filter;
  }

  toggleFilter() {
    const { showFilter } = this.state;
    this.setState({
      showFilter: !showFilter
    });
  }

  renderFilter() {
    const { showFilter } = this.state;
    const { classes, Filter } = this.props;
    if (!Filter) return null;
    return (
      <Modal
        className={classes.filterModal}
        open={showFilter}
        onClose={this.toggleFilter}
        disableEnforceFocus
      >
        <Paper className={classes.filterModalBody}>
          <Filter toggleFilter={this.toggleFilter} />
        </Paper>
      </Modal>
    );
  }

  renderActionButtons() {
    const { onAdd, classes } = this.props;
    if (this.props.hideActionButtons) {
      return null;
    }
    return (
      <Grid item xs={4} md={4} className={classes.fabContainer}>
        <Button
          className={classes.fab}
          disabled={!this.allowFilter()}
          onClick={this.toggleFilter}
        >
          <FilterListIcon />
          <Typography variant="button">Filtro</Typography>
        </Button>
        <Button
          className={classes.fab}
          disabled={!this.allowAdd()}
          onClick={onAdd}
          color="primary"
        >
          <AddIcon />
          <Typography variant="button">Adicionar</Typography>
        </Button>
      </Grid>
    );
  }

  renderTitle() {
    if (this.props.hideTitle) {
      return null;
    }
    return (
      <Grid item xs={8} md={8} className={this.props.classes.titleContainer}>
        <Typography variant="title">{this.props.title}</Typography>
      </Grid>
    );
  }

  render() {
    const { anchorElForActionsMenu, currentRowForActionsMenu } = this.state;
    const { classes, rows, actions, loading } = this.props;
    return (
      <JssProvider generateClassName={generateClassName}>
        <Fragment>
          <Grid container>
            {this.renderTitle()}
            {this.renderActionButtons()}
            {rows.length >= 100 ? (
              <Grid item xs={12}>
                <Typography variant="textSecondary" color="error" align="right">
                  Pesquisa limitada a 100 registros, utilize os filtros para
                  mais resultados.
                </Typography>
              </Grid>
            ) : (
              ""
            )}
            <Grid item xs={12}>
              <Grid container>
                <Hidden smDown>
                  <Grid item xs={12}>
                    <Paper>
                      {loading && <LinearProgress />}
                      <Table>
                        {this.renderTableHeader()}
                        {this.renderTableBody()}
                      </Table>
                    </Paper>
                  </Grid>
                </Hidden>
                <Hidden mdUp>
                  <Grid item xs={12}>
                    {this.renderMobileList()}
                    {rows.length == 0 ? (
                      <Typography align="center">Nenhum registro</Typography>
                    ) : (
                      ""
                    )}
                  </Grid>
                </Hidden>
              </Grid>
            </Grid>
            <ActionsMenu
              actions={actions}
              onClose={this.closeActionsMenu}
              anchorEl={anchorElForActionsMenu}
              currentRow={currentRowForActionsMenu}
            />
            {this.renderFilter()}
          </Grid>
        </Fragment>
      </JssProvider>
    );
  }
}

export default withStyles(styles)(CRUDTable);
