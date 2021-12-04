import { useEffect } from "react"
import styled from "styled-components"

const MapContainer = styled.div`
    width: 100%;
    height: 400px;
`

const accessToken =
    'pk.eyJ1IjoicGV0cnZhc2lsZXYiLCJhIjoiY2p1Y2VmaDBiMG5hMDQ0cHJldHM0bTJ3ZSJ9.AYFGrrKc4B2QeG2RGZTRJg'

export let map

export const MapComponent = ({
    defaultCoordinates = [72.9939, 60.52575]
}) => {

    useEffect(() => {
        const mapContainer = document.getElementById("map")
        if (mapContainer) {
            window.mapboxgl.accessToken = accessToken
            map = new window.mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/satellite-v9',
                center: defaultCoordinates,
                zoom: 9
            })
        }
    }, [])

    return <MapContainer id="map" />
}