/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useQuery } from '@apollo/client'

import { Label, LoadingView as Loading, MapComponent, map, Top } from '../components'
import { FIND_MANY_TARGET } from '../gqls'
import { Spin, List, Card as AntCard, Button } from 'antd'
import moment from 'moment'

const Container = styled.div`
    display: flex;
    position: relative;
    justify-content: space-between;

    .mapboxgl-ctrl-logo {
        display: none;
    }
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
    background-color: ${(props) => props.background};

    .ant-card-body {
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
    ${(props) => (props.selected ? 'border: 2px solid #1890ff' : null)};
`

const MapContainer = () => {
    const [selectedTarget, setSelectedTarger] = useState(null)
    const [selectedImage, setSelectedImage] = useState(null)

    let defaultCoordinates = [72.9939, 60.52575]

    useEffect(() => {
        if (selectedTarget && map) {
            map.flyTo({
                center: [selectedTarget.longitude, selectedTarget.latitude]
            })
        }
    }, [selectedTarget])

    const changeTarget = (newTarget) => {
        if (newTarget && map && newTarget.id !== selectedTarget.id) {
            map.flyTo({
                center: [newTarget.longitude, newTarget.latitude],
                zoom: 9,
                speed: 1
            })
            map.removeLayer(selectedTarget.id)
            map.removeLayer(selectedTarget.id + '-outline')
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
                        'line-width': 2
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
            if (findManyTarget.length > 0) {
                const firstTarget = findManyTarget[0]
                setSelectedTarger(firstTarget)
                if (firstTarget.images.length > 0) {
                    setSelectedImage(firstTarget.images[0])
                }
                if (map) {
                    for (let target of findManyTarget) {
                        if (target.images.length > 0) {
                            const firstImage = target.images[0]
                            for (let image of target.images) {
                                const coordinates = Object.values(image.cornerCoordinates)
                                map.addSource(image.id, {
                                    type: 'image',
                                    url: '/uploads/' + image.name,
                                    coordinates
                                })
                                map.addSource(image.id + '-polygon', {
                                    type: 'geojson',
                                    data: {
                                        type: 'Feature',
                                        geometry: {
                                            type: 'LineString',
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
                                    'line-width': 2
                                }
                            })
                            map.addLayer({
                                id: target.id,
                                type: 'raster',
                                source: firstImage.id
                            })
                        }
                    }
                }
            }
        },
        onError: (e) => {
            console.error(e)
        },
        fetchPolicy: 'network-only'
    })

    const targets = useMemo(() => (data && data.findManyTarget ? data.findManyTarget : []))

    const setLayoutImage = (image) => {
        if (map.getLayer(selectedTarget.id)) {
            map.removeLayer(selectedTarget.id)
            map.removeLayer(selectedTarget.id + '-outline')
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
                    'line-width': 2
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

    const exportData = () => {
        
    }

    return (
        <>
            <Top
                title="Карта"
                action={
                    <Button onClick={exportData} type="link">
                        Экспорт данных
                    </Button>
                }
            />
            <Container>
                {loading && (
                    <LoadingView>
                        <Spin />
                    </LoadingView>
                )}
                <MapDataContainer>
                    <MapComponent defaultCoordinates={defaultCoordinates} />
                    {selectedTarget && (
                        <Info>
                            <ImagesContainer>
                                {selectedTarget.images.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => setLayoutImage(item)}
                                        className="item"
                                    >
                                        <Image
                                            src={'/uploads/' + item.name}
                                            preview={false}
                                            selected={selectedImage && item.id === selectedImage.id}
                                        />
                                        <div className="date">
                                            {moment(item.date).format('DD.MM.YY')}
                                        </div>
                                        <div>{statusText(item.status)}</div>
                                    </div>
                                ))}
                            </ImagesContainer>
                            <Label label="Название" value={selectedTarget.name} />
                            <Label label="Общий статус" value={targetStatusText} />
                            <Label
                                label="Координаты"
                                value={`${selectedTarget.longitude}, ${selectedTarget.latitude}`}
                            />
                            <Label
                                label="Обновлено"
                                value={moment(selectedTarget.updatedAt).format('DD.mm.yyyy HH:mm')}
                            />
                        </Info>
                    )}
                </MapDataContainer>
                <Controls>
                    <List
                        className="list"
                        dataSource={targets}
                        rowKey={(item) => item.id}
                        grid={{ gutter: 0, column: 1 }}
                        renderItem={(item) => (
                            <List.Item onClick={() => changeTarget(item)}>
                                <Card
                                    background={
                                        selectedTarget && item.id === selectedTarget.id
                                            ? '#FAFAD2'
                                            : 'white'
                                    }
                                >
                                    <Label column label="Название" value={item.name} />
                                </Card>
                            </List.Item>
                        )}
                    />
                </Controls>
            </Container>
        </>
    )
}

export default MapContainer
