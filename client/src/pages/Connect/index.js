//this will be the Community Connect page where all the volunteers will be displayed

import React from "react";
import Container from "../../components/Container";
import Row from "../../components/Row";
import Col from "../../components/Col";
import './Connect.css';
import SlideView from "../../components/SlideView"

function Connect(props) {
    return (
        <div className="connectComponent">
            <div className="overlay">

                <Container>
                    <Row>
                        <Col size="md-12">
                            <h1>Volunteer profiles go here!</h1>
                            <h2>Hi, {props.globalUsername}!</h2>
                        </Col>
                    </Row>

                    <Row>
                        <SlideView gblUser={props.globalUsername} globalRoomId={props.globalRoomId}/>
                    </Row>
                </Container>

            </div>
        </div>
    )
}

export default Connect;