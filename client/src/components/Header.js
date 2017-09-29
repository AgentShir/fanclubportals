import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { logoutUser } from '../lib/auth'
import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import CloseIcon from 'material-ui/svg-icons/navigation/close'

const headerStyle = {
  cursor: 'pointer',
  boxShadow: 'none',
  textAlign: 'center',
  // backgroundColor: '#039BE5'
  backgroundColor: '#4267B2'
}

class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false
    }
  }
  handleToggle = () => this.setState({ open: !this.state.open });

  logout = () => {
    this.props.dispatch(logoutUser())
    this.handleToggle()
    this.props.history.push('/')
  }
  render() {
    return (
      <div>
        <AppBar
          title='Fan Club Portals'
          style={headerStyle}
          onTitleTouchTap={(e) => { this.props.history.push('/') }}
          onLeftIconButtonTouchTap={this.handleToggle}

        />
        <Drawer open={this.state.open}>
          <MenuItem onClick={this.handleToggle}>{<CloseIcon />}</MenuItem>
          {!this.props.isAuthenticated ?
            <div>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <MenuItem onClick={this.handleToggle}>Login</MenuItem>
              </Link>
              <Link to="/register" style={{ textDecoration: "none" }}>
                <MenuItem onClick={this.handleToggle}>Register</MenuItem>
              </Link>
              <Link to="/aboutUs" style={{ textDecoration: "none" }}>
                <MenuItem onClick={this.handleToggle}>About Us</MenuItem>
              </Link>
              <Link to="/contact" style={{ textDecoration: "none" }}>
                <MenuItem onClick={this.handleToggle}>Contact</MenuItem>
              </Link></div>
            : <div>
              <Link to="/home" style={{ textDecoration: "none" }}>
                <MenuItem onClick={this.handleToggle}>Home</MenuItem>
              </Link>
              {localStorage.getItem('portalId') === 'null' ?
                <div>
                  <Link to="/addPortal" style={{ textDecoration: "none" }}>
                    <MenuItem onClick={this.handleToggle}>Add Portal</MenuItem>
                  </Link>
                </div>
                : <div>
                  <Link to={`/updatePortal/${localStorage.portalId}`} style={{ textDecoration: "none" }}>
                    <MenuItem onClick={this.handleToggle}>Edit Portal</MenuItem>
                  </Link>
                  <Link to={`/${localStorage.portalId}/addEvent`} style={{ textDecoration: "none" }}>
                    <MenuItem onClick={this.handleToggle}>Add Event</MenuItem>
                  </Link>
                </div>
              }
              <Link to="/aboutUs" style={{ textDecoration: "none" }}>
                <MenuItem onClick={this.handleToggle}>About Us</MenuItem>
              </Link>
              <Link to="/contact" style={{ textDecoration: "none" }}>
                <MenuItem onClick={this.handleToggle}>Contact</MenuItem>
              </Link>
              <MenuItem onClick={this.logout}>Logout</MenuItem>
            </div>}
        </Drawer>
      </div>
    )
  }
}
function mapStateToProps(appState) {
  const { isAuthenticated, errorMessage, isFetching } = appState.auth
  return {
    isAuthenticated,
    isFetching,
    errorMessage
  }
}


export default withRouter(connect(mapStateToProps)(Header))
