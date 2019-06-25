import React from 'react';
import { GoogleMap, DirectionsService, DirectionsRenderer, Autocomplete } from '@react-google-maps/api'



class Map extends React.Component {

    constructor(props) {
        super(props)


        this.state = {
            response: null,
            travelMode: 'BICYCLING',
            origin: '',
            destination: ''
        }


        this.directionsCallback = this.directionsCallback.bind(this)
        this.checkDriving = this.checkDriving.bind(this)
        this.checkBicycling = this.checkBicycling.bind(this)
        this.checkWalking = this.checkWalking.bind(this)
        this.getOrigin = this.getOrigin.bind(this)
        this.getDestination = this.getDestination.bind(this)
        this.onClick = this.onClick.bind(this)
        this.onMapClick = this.onMapClick.bind(this)
        this.autocomplete = null
        this.onLoad = this.onLoad.bind(this)
        this.onPlaceChanged = this.onPlaceChanged(this)
    }

    onLoad(autocomplete) {
        console.log('autocomplete: ', autocomplete)
        this.autocomplete = autocomplete
    }

    onPlaceChanged() {
        if (this.autocomplete !== null) {
            console.log(this.autocomplete.getPlace())
        } else {
            console.log('Autocomplete is not loaded yet!')
        }
    }



    directionsCallback(response) {
        console.log(response)

        if (response !== null) {
            if (response.status === 'OK') {
                this.setState(
                    () => ({
                        response
                    })
                )
            } else {
                console.log('response: ', response)
            }
        }
    }

    checkDriving({ target: { checked } }) {
        checked &&
            this.setState(
                () => ({
                    travelMode: 'DRIVING'
                })
            )
    }

    checkBicycling({ target: { checked } }) {
        checked &&
            this.setState(
                () => ({
                    travelMode: 'BICYCLING'
                })
            )
    }



    checkWalking({ target: { checked } }) {
        checked &&
            this.setState(
                () => ({
                    travelMode: 'WALKING'
                })
            )
    }

    getOrigin(ref) {
        this.origin = ref
    }

    getDestination(ref) {
        this.destination = ref
    }


    onClick() {
        if (this.origin.value !== '' && this.destination.value !== '') {
            this.setState(
                () => ({
                    origin: this.origin.value,

                    destination: this.destination.value
                })
            )
        }
    }

    onMapClick(...args) {
        console.log('onClick args: ', args)
    }



    render() {

        const styleMargin = {
            margin: "15px 0"
        };

        return (

            <div className='map ui segment'>
                <div className='map-settings'>

                    <div className='map-search'>

                        <label htmlFor='ORIGIN'>Origin:</label>

                        <Autocomplete
                            onLoad={this.onLoad}
                            onPlacesChanged={this.onPlaceChanged}
                        >
                            <div className="ui fluid icon input" style={styleMargin}>
                                <input id='ORIGIN' className='form-control' type='text' placeholder="Search..." ref={this.getOrigin} />
                                <i className="search icon"></i>
                            </div>
                        </Autocomplete>

                        <label htmlFor='DESTINATION'>Destination:</label>

                        <Autocomplete
                            onLoad={this.onLoad}
                            onPlacesChanged={this.onPlaceChanged}
                        >
                            <div className="ui fluid icon input" style={styleMargin}>
                                <input id='DESTINATION' className='form-control' type='text' placeholder="Search..." ref={this.getDestination} />
                                <i className="search icon"></i>
                            </div>
                        </Autocomplete>
                    </div>


                    <div className="map-radio ui form" style={styleMargin}>
                        <div className="inline fields">
                            <div className="field">
                                <div className="ui radio checkbox">
                                    <input
                                        id='DRIVING'
                                        name='travelMode'
                                        type='radio'
                                        checked={this.state.travelMode === 'DRIVING'}
                                        onChange={this.checkDriving}
                                    />
                                    <label htmlFor='DRIVING'><i className="car icon"></i></label>
                                </div>
                            </div>
                            <div className="field">
                                <div className="ui radio checkbox">
                                    <input
                                        id='BICYCLING'
                                        name='travelMode'
                                        type='radio'
                                        checked={this.state.travelMode === 'BICYCLING'}
                                        onChange={this.checkBicycling}
                                    />
                                    <label htmlFor='BICYCLING'><i className="bicycle icon"></i></label>
                                </div>
                            </div>

                            <div className="field">
                                <div className="ui radio checkbox">
                                    <input
                                        id='WALKING'
                                        name='travelMode'
                                        type='radio'
                                        checked={this.state.travelMode === 'WALKING'}
                                        onChange={this.checkWalking}
                                    />
                                    <label htmlFor='WALKING'><i className="male icon"></i></label>
                                </div>
                            </div>
                        </div>
                    </div>


                    <button className='fluid ui button' type='button' onClick={this.onClick} style={styleMargin}>Build Route</button>
                </div>

                <div className='map-container'>
                    <GoogleMap
                        // required
                        id='direction-example'
                        // required
                        mapContainerStyle={{
                            height: '400px',
                            width: '100%'
                        }}
                        // required
                        zoom={2}
                        // required
                        center={{
                            lat: 0,
                            lng: -180
                        }}
                        // optional
                        onClick={this.onMapClick}
                        // optional
                        onLoad={map => {
                            console.log('DirectionsRenderer onLoad map: ', map)
                        }}
                        // optional
                        onUnmount={map => {
                            console.log('DirectionsRenderer onUnmount map: ', map)
                        }}
                    >
                        {
                            (
                                this.state.destination !== '' &&
                                this.state.origin !== ''

                            ) && (
                                <DirectionsService
                                    // required
                                    options={{ // eslint-disable-line react-perf/jsx-no-new-object-as-prop
                                        destination: this.state.destination,
                                        origin: this.state.origin,
                                        travelMode: this.state.travelMode,
                                    }}
                                    // required
                                    callback={this.directionsCallback}
                                    // optional
                                    onLoad={directionsService => {
                                        console.log('DirectionsService onLoad directionsService: ', directionsService)
                                    }}
                                    // optional
                                    onUnmount={directionsService => {
                                        console.log('DirectionsService onUnmount directionsService: ', directionsService)
                                    }}
                                />
                            )
                        }

                        {
                            this.state.response !== null && (
                                <DirectionsRenderer
                                    // required
                                    options={{ // eslint-disable-line react-perf/jsx-no-new-object-as-prop
                                        directions: this.state.response
                                    }}
                                    // optional
                                    onLoad={directionsRenderer => {
                                        console.log('DirectionsRenderer onLoad directionsRenderer: ', directionsRenderer)
                                    }}
                                    // optional
                                    onUnmount={directionsRenderer => {
                                        console.log('DirectionsRenderer onUnmount directionsRenderer: ', directionsRenderer)
                                    }}
                                />
                            )
                        }
                    </GoogleMap>
                </div>
            </div>
        );
    }
};



export default Map;