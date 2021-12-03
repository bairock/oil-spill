import { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { useQuery } from '@apollo/client'

import { Label, LoadingView as Loading } from '../components'
import { FIND_MANY_TARGET } from '../gqls'
import {
    Spin,
    List,
    Card as AntCard
} from 'antd'
import moment from 'moment'

const accessToken =
    'pk.eyJ1IjoicGV0cnZhc2lsZXYiLCJhIjoiY2p1Y2VmaDBiMG5hMDQ0cHJldHM0bTJ3ZSJ9.AYFGrrKc4B2QeG2RGZTRJg'

const Container = styled.div`
    display: flex;
    position: relative;
    justify-content: space-between;
`

const MapContainer = styled.div`
    width: 68%;
    height: 400px;
`

const LoadingView = styled(Loading)`
    width: 68%;
    height: 400px;
    position: absolute;
    z-index: 2;
`

const Controls = styled.div`
    width: 30%;
    height: 700px;
    overflow-y: scroll;
    overflow-x: visible;

    .list {
        padding: 0 10px;
    }
`

const Card = styled(AntCard)`
    box-sizing: border-box;
    border: 1px solid silver;
    cursor: pointer;
    background-color: ${props => props.background};
`

const MapComponent = () => {
    let mapRef = useRef(new Map()).current
    const [selectedTarget, setSelectedTager] = useState(null)

    let defaultCoordinates = [72.9939, 60.52575]

    const initMap = () => {
        let map = mapRef.get("map")
        const mapContainer = document.getElementById("map")
        if (!map && mapContainer) {
            window.mapboxgl.accessToken = accessToken
            map = new window.mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/satellite-v9',
                center: defaultCoordinates,
                zoom: 10.7
            })
            mapRef.set("map", map)
        }
        return map
    }

    useEffect(() => {
        const map = mapRef.get("map")
        if (selectedTarget && map) {
            map.flyTo({
                center: [selectedTarget.longitude, selectedTarget.latitude]
            })
        }
    }, [selectedTarget])

    const { data, loading } = useQuery(FIND_MANY_TARGET, {
        onCompleted: ({ findManyTarget }) => {
            if (findManyTarget.length > 0) {
                setSelectedTager(findManyTarget[0])
                const map = initMap()
                if (map) {
                    map.on('load', () => {
                        for (let target of findManyTarget) {
                            map.addSource(target.id, {
                                type: 'image',
                                url: '/uploads/' + target.image,
                                coordinates: Object.values(target.cornerCoordinates)
                            })
                            map.addLayer({
                                id: new Date().getTime().toString(),
                                type: 'raster',
                                source: target.id,

                            })
                        }
                    })
                }
            }
        },
        onError: e => {
            initMap()
        },
        fetchPolicy: "network-only"
    })

    const targets = useMemo(() => data && data.findManyTarget ? data.findManyTarget : [])

    return (
        <Container>
            {loading && (
                <LoadingView>
                    <Spin />
                </LoadingView>
            )}
            <MapContainer id="map" />
            <Controls>
                <List
                    className="list"
                    dataSource={targets}
                    rowKey={item => item.id}
                    grid={{ gutter: 0, column: 1 }}
                    renderItem={item => (
                        <List.Item
                            onClick={() => setSelectedTager(item)}
                        >
                            <Card
                                background={selectedTarget && item.id === selectedTarget.id ? "#FAFAD2" : "white"}
                            >
                                <Label
                                    column
                                    label="Координаты"
                                    value={`${item.longitude} - ${item.latitude}`}
                                />
                                <Label
                                    column
                                    label="Дата"
                                    value={moment(item.date).format("DD.MM.yyyy HH:mm")}
                                />
                            </Card>
                        </List.Item>
                    )}
                />
            </Controls>
        </Container>
    )
}

export default MapComponent
