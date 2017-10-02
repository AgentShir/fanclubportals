import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Authorize } from '../lib/auth'
import { getPortalInfo } from '../actions/app'
import UserEvents from './UserEvents'
import { Card, CardText, CardHeader} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import CircularProgress from 'material-ui/CircularProgress'
import { Tabs, Tab } from 'material-ui/Tabs';

const cardStyle = {
    maxWidth: '1000px',
    margin: '10px auto',

}
const cardHeaderStyle = {
    textAlign: 'center'
}
const titleStyle = {
    fontSize: '50px'
}
const tabStyle={
    backgroundColor:'inherit'
}
const inkBarStyle={
    backgroundColor:'black'
}
const tab={
    color:'black'
}
// function handleActive(tab) {
//     alert(`A tab with this route property ${tab.props['data-route']} was activated.`);
// }

class UserHomepage extends Component {
    componentWillMount() {
        let portalId = localStorage.getItem('portalId')
        getPortalInfo(portalId)
    }
    addEvent = (e) => {
        this.props.history.push(`/${localStorage.portalId}/addEvent`)
    }
    updatePortal = (e) =>{
        this.props.history.push(`/updatePortal/${localStorage.portalId}`)
    }
    addPortal = (e) =>{
        this.props.history.push(`/${localStorage.portalId}/addEvent`)
    }
    render() {
        return (
            <div className="portalContainer">
                <Card style={cardStyle} className="headerCard">
                    <CardHeader style={cardHeaderStyle} className="mainHeader"
                        title={"Welcome " + localStorage.getItem('username')}
                        titleStyle={titleStyle}
                    />
                </Card>
                {this.props.portalInfo.fanClubName
                    ? <Tabs
                        tabItemContainerStyle={tabStyle}
                        inkBarStyle={inkBarStyle}>
                        <Tab label="home" buttonStyle={tab}>
                            <Card>
                                <CardText>
                                    {localStorage.getItem('portalId')=== 'null'
                                    ? <div>
                                        <h3>You can create your own fan portal. </h3>
                                        <FlatButton label="Create Portal" type="submit" onClick={this.addPortal} />
                                    </div>
                                    :<div>
                                        <h3> Update your Portal</h3>
                                        <FlatButton label="Update Portal" type="submit" onClick={this.editPortal} />
                                    </div>
                                    }
                                </CardText>
                            </Card>
                        </Tab>
                        <Tab label={this.props.portalInfo.fanClubName + "Upcoming Events"} buttonStyle={tab}>
                            <Card >
                                <CardText>
                                <FlatButton label="Add Event" type="submit" onClick={this.addEvent} />
                                    <UserEvents events={this.props.portalEvents} />
                                </CardText>
                            </Card>
                        </Tab>
                        <Tab label="Portals I'm following" buttonStyle={tab}>
                        <Card>
                                <CardText>
                                </CardText>
                            </Card>
                        </Tab>
                    </Tabs>
                    : <Card style={cardHeaderStyle} className="headerCard">
                        <CircularProgress size={80} thickness={5} />
                    </Card>
                }
            </div>
        )
    }
}

const stateToProps = function (appState) {
    const { portalInfo, portalEvents } = appState.app
    return {
        portalInfo,
        portalEvents
    }
}

export default connect(stateToProps)(Authorize(UserHomepage))