import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { List, Input, Button } from 'antd'

const accessToken =
    'pk.eyJ1IjoicGV0cnZhc2lsZXYiLCJhIjoiY2p1Y2VmaDBiMG5hMDQ0cHJldHM0bTJ3ZSJ9.AYFGrrKc4B2QeG2RGZTRJg'

const MapContainer = styled.div`
    width: 800px;
    height: 500px;
`

const Map = () => {
    let mapRef = useRef()

    let coordinates = [72.9939, 60.52575]
    let imageName = 'customImage'

    useEffect(() => {
        window.mapboxgl.accessToken = accessToken
        let map = new window.mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/satellite-v9',
            center: coordinates,
            zoom: 12
        })
        mapRef.current = map

        map.on('load', () => {
            map.loadImage('/example-1.jpg', (error, image) => {
                if (error) throw error
                map.addImage(imageName, image)
            })
        })
    }, [])

    return (
        <div>
            <MapContainer id="map" />
        </div>
    )
}

export default Map
