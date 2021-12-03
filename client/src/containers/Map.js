import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { useQuery } from '@apollo/client'

import { Label, LoadingView as Loading } from '../components'
import { FIND_MANY_TARGET } from '../gqls'
import {
    Spin,
    List,
    Card as AntCard,
    Image as AntImage
} from 'antd'
import moment from 'moment'

const accessToken =
    'pk.eyJ1IjoicGV0cnZhc2lsZXYiLCJhIjoiY2p1Y2VmaDBiMG5hMDQ0cHJldHM0bTJ3ZSJ9.AYFGrrKc4B2QeG2RGZTRJg'

const Container = styled.div`
    display: flex;
    position: relative;
    justify-content: space-between;

    .mapboxgl-ctrl-logo {
        display: none;
    }
`

const MapContainer = styled.div`
    width: 100%;
    height: 400px;
`

const MapDataContainer = styled.div`
    width: 68%;
`

const Info = styled.div`
    margin-top: 15px;
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
    
    .ant-card-body{
        padding: 15px;
    }
`

const ImagesContainer = styled.div`
    width: 100%;
    padding-bottom: 15px;
    overflow-x: scroll;
    display: flex;

    .item {
        width: 90px;
        margin-right: 10px;
        cursor: pointer;

        .date {
            font-size: 14px;
            font-weight: 600;
            /* line-height: 1.5px; */
        }
    }
`

const Image = styled.img`
    width: 90px;
    height: 90px;
    ${props => props.selected ? 'border: 2px solid #1890ff' : null};
`

const MapComponent = () => {
    let mapRef = useRef(new Map()).current
    const [selectedTarget, setSelectedTarger] = useState(null)
    const [selectedImage, setSelectedImage] = useState(null)

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
                zoom: 8
            })
            mapRef.set("map", map)
        }
        return map
    }

    useEffect(() => {
        const map = mapRef.get("map")
        if (selectedTarget && map) {
            map.flyTo({
                center: [selectedTarget.longitude, selectedTarget.latitude],
            })
            setSelectedImage(selectedImage)
        }
    }, [selectedTarget])

    const changeTarget = (newTarget) => {
        const map = mapRef.get("map")
        if (newTarget && map && newTarget.id !== selectedTarget.id) {
            map.flyTo({
                center: [newTarget.longitude, newTarget.latitude],
            })
            map.removeLayer(selectedTarget.id)
            map.removeLayer(selectedTarget.id + "-outline")
            const { images } = newTarget
            if (images.length > 0) {
                const firstImage = images[0]
                setSelectedImage(firstImage)
                setSelectedTarger(newTarget)
                map.addLayer({
                    id: newTarget.id + '-outline',
                    type: 'line',
                    source: firstImage.id + '-polygon',
                    paint: {
                        'line-color': '#23ff3e',
                        'line-width': 2,
                    }
                })
                map.addLayer({
                    id: newTarget.id,
                    type: 'raster',
                    source: firstImage.id
                })
            }
        }
    }

    const { data, loading } = useQuery(FIND_MANY_TARGET, {
        onCompleted: ({ findManyTarget }) => {
            const map = initMap()
            if (findManyTarget.length > 0) {
                setSelectedTarger(findManyTarget[0])
                if (map) {
                    map.on('load', () => {
                        for (let target of findManyTarget) {
                            if (target.images.length > 0) {
                                const firstImage = target.images[0]
                                setSelectedImage(firstImage)
                                for (let image of target.images) {
                                    const coordinates = Object.values(image.cornerCoordinates)
                                    map.addSource(image.id, {
                                        type: 'image',
                                        url: '/uploads/' + image.name,
                                        coordinates
                                    })
                                    map.addSource(image.id + '-polygon', {
                                        'type': 'geojson',
                                        'data': {
                                            'type': 'Feature',
                                            'geometry': {
                                                'type': 'LineString',
                                                coordinates: [...coordinates, coordinates[0]]
                                            }
                                        }
                                    })
                                }
                                map.addLayer({
                                    id: target.id + '-outline',
                                    type: 'line',
                                    source: firstImage.id + '-polygon',
                                    paint: {
                                        'line-color': '#23ff3e',
                                        'line-width': 2,
                                    }
                                })
                                map.addLayer({
                                    id: target.id,
                                    type: 'raster',
                                    source: firstImage.id
                                })
                            }
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

    const setLayoutImage = (image) => {
        const map = mapRef.get("map")
        if (map.getLayer(selectedTarget.id)) {
            map.removeLayer(selectedTarget.id)
            map.removeLayer(selectedTarget.id + "-outline")
            map.addLayer({
                id: selectedTarget.id,
                type: 'raster',
                source: image.id
            })
            map.addLayer({
                id: selectedTarget.id + '-outline',
                type: 'line',
                source: image.id + '-polygon',
                paint: {
                    'line-color': '#23ff3e',
                    'line-width': 2,
                }
            })
            setSelectedImage(image)
        }
    }

    const statusText = useCallback((status) => {
        let statusText = '-'
        let statusColor = 'silver'
        if (status == 0) {
            statusText = 'В обработке'
        }
        if (status == 1) {
            statusColor = 'limegreen'
            statusText = 'Утечки нет'
        }
        if (status == 2) {
            statusColor = 'red'
            statusText = 'Обнаружена утечка'
        }
        return <div style={{ color: statusColor, fontSize: 12, lineHeight: 1 }}>{statusText}</div>
    }, [])

    const targetStatusText = useMemo(() => {
        if (selectedTarget && selectedTarget.images.length > 0) {
            const { status } = selectedTarget.images[0]
            if (status == 0) {
                return 'В обработке'
            }
            if (status == 1) {
                return 'Утечки нет'
            }
            if (status == 2) {
                return 'Обнаружена утечка'
            }
        }
        return '-'
    }, [selectedTarget])

    return (
        <Container>
            {loading && (
                <LoadingView>
                    <Spin />
                </LoadingView>
            )}
            <MapDataContainer>
                <MapContainer id="map" />
                {
                    selectedTarget && (
                        <Info>
                            <ImagesContainer>
                                {
                                    selectedTarget.images.map(item => (
                                        <div key={item.id} onClick={() => setLayoutImage(item)} className="item">
                                            <Image
                                                src={'/uploads/' + item.name}
                                                preview={false}
                                                selected={selectedImage && item.id === selectedImage.id}
                                            />
                                            <div className="date">{moment(item.date).format("DD.MM.YY")}</div>
                                            <div>{statusText(item.status)}</div>
                                        </div>
                                    ))
                                }
                            </ImagesContainer>
                            <Label
                                label="Название"
                                value={selectedTarget.name}
                            />
                            <Label
                                label="Общий статус"
                                value={targetStatusText}
                            />
                            <Label
                                label="Координаты"
                                value={`${selectedTarget.longitude}, ${selectedTarget.latitude}`}
                            />
                            <Label
                                label="Обновлено"
                                value={moment(selectedTarget.updatedAt).format("DD.mm.yyyy HH:mm")}
                            />
                        </Info>
                    )
                }
            </MapDataContainer>
            <Controls>
                <List
                    className="list"
                    dataSource={targets}
                    rowKey={item => item.id}
                    grid={{ gutter: 0, column: 1 }}
                    renderItem={item => (
                        <List.Item
                            onClick={() => changeTarget(item)}
                        >
                            <Card
                                background={selectedTarget && item.id === selectedTarget.id ? "#FAFAD2" : "white"}
                            >
                                <Label
                                    column
                                    label="Название"
                                    value={item.name}
                                />
                                {/* <Label
                                    column
                                    label="Статус"
                                    value={item.status}
                                /> */}
                            </Card>
                        </List.Item>
                    )}
                />
            </Controls>
        </Container>
    )
}

export default MapComponent