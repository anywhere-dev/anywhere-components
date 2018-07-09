import React, { Component, Fragment } from "react";

import { Paper } from "material-ui";

import { withStyles } from "material-ui/styles";

import { JssProvider } from "react-jss";

import { createGenerateClassName } from "react-jss";

const generateClassName = createGenerateClassName();

const styles = theme => ({
  container: {
    padding: theme.spacing.unit * 2
  }
});

class PaperContainer extends Component {
  render() {
    const { children, classes } = this.props;
    return (
      <JssProvider generateClassName={generateClassName}>
        <Paper className={classes.container}>{children}</Paper>
      </JssProvider>
    );
  }
}

export default withStyles(styles)(PaperContainer);
