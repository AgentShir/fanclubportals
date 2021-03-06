import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Authorize } from '../lib/auth'
import { postPortals, getPortalCategories, resetPortalForm } from '../actions/app'
import TextField from 'material-ui/TextField'
import { Card, CardActions, CardText } from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import { getPortalInfo, updatePortal, updateComplete } from '../actions/app'
import MenuItem from 'material-ui/MenuItem'
import SelectField from 'material-ui/SelectField'
import CircularProgress from 'material-ui/CircularProgress'

const cardStyle = {
    maxWidth: '1000px',
    margin: '50px auto',
    backgroundColor: '#FFFFFF'
}
const buttonStyle = {
    textAlign: 'right'
}
const errorMessageStyle = {
    fontSize: '20px'
}
const progressCard = {
    maxWidth: '1000px',
    textAlign: 'center',
    paddingBottom: '50px'
}

class CreatePortal extends Component {
    static defaultProps = {
        fanClubName: '',
        fanClubLocation: '',
        category: '',
        MenuItem: '',
        logo: '',
        description: ''
    }
    constructor(props) {
        super(props)
        this.state = {
            fanClubName: '',
            fanClubLocation: '',
            category: '',
            MenuItem: '',
            logo: '',
            description: '',
            showProgress: false
        }
    }

    componentWillMount() {
        if (localStorage.getItem('portalId') !== 'null') {
            let userId = localStorage.getItem('userId')
            getPortalInfo(localStorage.getItem('portalId'), userId)
            getPortalCategories()

        } else {
            getPortalCategories()
        }
    }
    componentWillUnmount() {
        this.setState({})
        resetPortalForm()
    }
    componentWillReceiveProps(props) {
        if (this.props.location.pathname === '/addPortal') {
            if (props.updateStatus === 'fail') {
                this.setState({ expanded: true, showProgress: false })
            } else if (props.updateStatus === 'success') {
                this.setState({ expanded: false, showProgress: true })
                setTimeout(() => {
                    this.props.history.push('/portal/' + props.portalId)
                }, 2000)
            }
            //if editing portal
        } else {
            this.setState({
                fanClubName: props.fanClubName,
                fanClubLocation: props.fanClubLocation,
                category: props.categoryId,
                logo: props.logo,
                description: props.description
            })
            if (props.updateStatus === "success") {
                this.setState({ expanded: false })
                setTimeout(() => {
                    this.props.history.push('/portal/' + localStorage.getItem('portalId'))
                }, 2000)
                updateComplete()
            } else if (props.updateStatus === "fail") {
                this.setState({ expanded: true, showProgress:false})
            }
        }
    }

    handleExpandChange = (expanded) => {
        this.setState({ expanded: expanded });
    }

    handleSelect = (e, index, value) => {
        e.preventDefault()
        this.setState({ category: value })
    }

    handleChange = (e) => {
        e.preventDefault()
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleSubmit = (e) => {
        e.preventDefault()
        this.setState({ showProgress: true })
        if (this.props.location.pathname === '/addPortal') {
            postPortals(this.state)
            this.setState({ fanClubName: '', fanClubLocation: '', category: '', logo: '', description: '' })
        } else {
            updatePortal(localStorage.getItem('portalId'), this.state)
        }
    }
    cancel = (e) => {
        e.preventDefault()
        this.props.history.push('/dashboard/0')
    }
    render() {
        return (
            <Card style={cardStyle} expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
              <div className="imageAlign">
                <h1>Portal</h1>
              </div>
                  <CardText expandable={true} color={'red'} style={errorMessageStyle}>
                      {this.props.errorMessage}
                  </CardText>
                {this.state.showProgress === false
                    ? <form onSubmit={this.handleSubmit}>
                        <CardText>
                            <TextField
                                hintText="Name"
                                floatingLabelText="Name Your Fan Club"
                                name="fanClubName"
                                value={this.state.fanClubName}
                                onChange={this.handleChange}
                                autoComplete="off"
                                fullWidth={true}
                                required={true}
                            /><br />
                            <TextField
                                hintText="Location"
                                floatingLabelText="Tell us your Location"
                                name="fanClubLocation"
                                value={this.state.fanClubLocation}
                                onChange={this.handleChange}
                                autoComplete="off"
                                fullWidth={true}
                                required={true}
                            /><br />
                            <SelectField
                                onChange={this.handleSelect}
                                value={this.state.category}
                                floatingLabelText="Select a Category"
                                name="category"
                                fullWidth={true}
                                selectedMenuItemStyle={{color:'#85C0EA'}}
                            >
                                {this.props.portalCategories.map((category) => (
                                    <MenuItem key={category.id} value={category.id} primaryText={category.category} />
                                ))}
                            </SelectField>
                            <br />
                            <TextField
                                hintText="Web address"
                                floatingLabelText="Enter a web address to display a photo"
                                name="logo"
                                value={this.state.logo}
                                onChange={this.handleChange}
                                autoComplete="off"
                                fullWidth={true}
                                required={false}
                                type='URL'
                            /><br />
                            <TextField
                                hintText="Description"
                                floatingLabelText="Tell us about your portal"
                                name="description"
                                autoComplete="off"
                                value={this.state.description}
                                onChange={this.handleChange}
                                fullWidth={true}
                                required={false}
                            /><br />

                        </CardText>
                        <CardActions style={buttonStyle}>
                            <RaisedButton label="Cancel" type="button" onClick={this.cancel} />
                            <RaisedButton backgroundColor='#002642' labelColor='#F7F9FB' label="Submit" type="Submit" />
                        </CardActions>
                    </form>
                    : <div style={progressCard}>
                        <CircularProgress size={80} thickness={5} />
                    </div>
                }
            </Card>
        )
    }
}
function mapStateToProps(appState) {
    const { errorMessage, portalId, portalInfo, updateStatus, portalCategories, gotInfo } = appState.app
    return {
        errorMessage,
        portalId,
        ...portalInfo,
        updateStatus,
        portalCategories,
        gotInfo
    }
}
export default connect(mapStateToProps)(Authorize(CreatePortal))
