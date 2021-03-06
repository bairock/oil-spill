/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'
import { Spin, List, Card as AntCard, Button, Modal, Form, Select } from 'antd'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import styled from 'styled-components'

import { Label, LoadingView as Loading, MapComponent, map, Top } from '../components'
import { FIND_MANY_TARGET } from '../gqls'
import { FIND_MANY_WORKER } from '../gqls/worker'

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

const MapContainer = ({ history }) => {
    const [selectedTarget, setSelectedTarger] = useState(null)
    const [selectedImage, setSelectedImage] = useState(null)
    const [workerModalVisible, setWorkerModalVisible] = useState(false)
    const [selectedWorker, setSelectedWorker] = useState(undefined)

    let defaultCoordinates = [72.9939, 60.52575]

    const navigate = useNavigate()

    useEffect(() => {
        if (selectedTarget && map) {
            map.flyTo({
                center: [selectedTarget.longitude, selectedTarget.latitude]
            })
        }
    }, [selectedTarget])

    const { data: workersData } = useQuery(FIND_MANY_WORKER)

    const workers = workersData ? workersData.findManyWorker : []

    const changeTarget = (newTarget) => {
        if (newTarget && map && newTarget.id !== selectedTarget.id) {
            map.flyTo({
                center: [newTarget.longitude, newTarget.latitude],
                zoom: 9,
                speed: 1
            })
            if (map.getLayer(selectedTarget.id)) {
                map.removeLayer(selectedTarget.id)
                map.removeLayer(selectedTarget.id + '-outline')
            }
            const { images } = newTarget
            if (images.length > 0) {
                const firstImage = images[0]
                setSelectedImage(firstImage)
                setSelectedTarger(newTarget)
                map.addLayer({
                    id: newTarget.id,
                    type: 'raster',
                    source: firstImage.id
                })
                map.addLayer({
                    id: newTarget.id + '-outline',
                    type: 'line',
                    source: firstImage.id + '-polygon',
                    paint: {
                        'line-color': '#23ff3e',
                        'line-width': 2
                    }
                })
            }
        }
    }

    useEffect(() => {
        return () => {
            if (map) {
                map.remove()
            }
        }
    }, [])

    const { data, loading } = useQuery(FIND_MANY_TARGET, {
        onCompleted: async ({ findManyTarget }) => {
            if (findManyTarget.length > 0) {
                const firstTarget = findManyTarget[0]
                if (selectedTarget) {
                    await map.removeLayer(selectedTarget.id)
                    await map.removeLayer(selectedTarget.id + '-outline')
                }
                setSelectedTarger(firstTarget)
                if (firstTarget.images.length > 0) {
                    setSelectedImage(firstTarget.images[0])
                }
                if (map) {
                    for (let target of findManyTarget) {
                        if (target.images.length > 0) {
                            for (let image of target.images) {
                                const coordinates = Object.values(image.cornerCoordinates)
                                const source = await map.getSource(image.id)
                                if (source) {
                                    await map.removeSource(image.id)
                                    await map.removeSource(image.id + '-polygon')
                                }
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
                        }
                    }
                    if (!map.getLayer(firstTarget.id)) {
                        if (
                            firstTarget.images.length > 0 &&
                            map.getSource(firstTarget.images[0].id) &&
                            map.getSource(firstTarget.images[0].id + '-polygon')
                        ) {
                            const firstImage = firstTarget.images[0]
                            map.addLayer({
                                id: firstTarget.id + '-outline',
                                type: 'line',
                                source: firstImage.id + '-polygon',
                                paint: {
                                    'line-color': '#23ff3e',
                                    'line-width': 2
                                }
                            })
                            map.addLayer({
                                id: firstTarget.id,
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
        fetchPolicy: 'network-only',
        pollInterval: 5000
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
            statusText = '?? ??????????????????'
        }
        if (status == 1) {
            statusColor = 'limegreen'
            statusText = '???????????? ??????'
        }
        if (status == 2) {
            statusColor = 'red'
            statusText = '???????????????????? ????????????'
        }
        return <div style={{ color: statusColor, fontSize: 12, lineHeight: 1 }}>{statusText}</div>
    }, [])

    const targetStatusText = useMemo(() => {
        if (selectedTarget && selectedTarget.images.length > 0) {
            const { status } = selectedTarget.images[0]
            if (status == 0) {
                return '?? ??????????????????'
            }
            if (status == 1) {
                return '???????????? ??????'
            }
            if (status == 2) {
                return '???????????????????? ????????????'
            }
        }
        return '-'
    }, [selectedTarget])

    const exportCSV = () => {
        let stockData = selectedTarget.images.map((item) => {
            let foundImage = item.status === 2 ? item.date : null
            return {
                '???': new Date().getTime().toString(),
                '???????? ??????????????????????': foundImage ? moment(foundImage).format('DD.MM.YYYY HH:mm') : '',
                '?????????????? ?????????????????????????? ?????????????? (????)': foundImage ? '0,0368 + 0,0166' : '0',
                ??????????????: selectedTarget.longitude,
                ????????????: selectedTarget.latitude,
                '???????????????? ??????????????': selectedTarget.name,
                '???????? ??????????????????????': moment(selectedTarget.createdAt).format('DD.MM.YYYY HH:mm'),
                '?????????????????? ????????????': '?????????? ?????????????? ??????????'
            }
        })
        const convertArrayOfObjectsToCSV = (args) => {
            let result, ctr, keys, columnDelimiter, lineDelimiter, data

            data = args.data || null
            if (data == null || !data.length) {
                return null
            }

            columnDelimiter = args.columnDelimiter || ','
            lineDelimiter = args.lineDelimiter || '\n'

            keys = Object.keys(data[0])

            result = ''
            result += keys.join(columnDelimiter)
            result += lineDelimiter

            data.forEach(function (item) {
                ctr = 0
                keys.forEach(function (key) {
                    if (ctr > 0) result += columnDelimiter

                    result += item[key]
                    ctr++
                })
                result += lineDelimiter
            })

            return result
        }
        const downloadCSV = (args) => {
            let data, filename, link
            let csv = convertArrayOfObjectsToCSV({
                data: stockData
            })
            if (csv == null) return

            filename = args.filename || 'export.csv'

            if (!csv.match(/^data:text\/csv/i)) {
                csv = 'data:text/csv;charset=utf-8,' + csv
            }
            data = encodeURI(csv)

            link = document.createElement('a')
            link.setAttribute('href', data)
            link.setAttribute('download', filename)
            link.click()
        }

        downloadCSV({})
    }

    return (
        <>
            <Top
                title="??????????"
                action={
                    <div>
                        {/* <Link to={`/target/${selectedTarget ? selectedTarget.id : ''}`}> */}
                        <Button onClick={() => setWorkerModalVisible(true)} type="link">
                            ?????????????? PDF
                        </Button>
                        {/* </Link> */}
                        <Button onClick={exportCSV} type="link">
                            ?????????????? CSV
                        </Button>
                    </div>
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
                                            {moment(item.date).format('DD.MM.YY HH:mm')}
                                        </div>
                                        <div>{statusText(item.status)}</div>
                                    </div>
                                ))}
                            </ImagesContainer>
                            <Label label="????????????????" value={selectedTarget.name} />
                            <Label label="?????????? ????????????" value={targetStatusText} />
                            <Label
                                label="????????????????????"
                                value={`${selectedTarget.latitude}, ${selectedTarget.longitude}`}
                            />
                            <Label
                                label="??????????????????"
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
                                    <Label column label="????????????????" value={item.name} />
                                </Card>
                            </List.Item>
                        )}
                    />
                </Controls>
            </Container>

            <Modal
                title="???????????????? ????????????????????"
                visible={workerModalVisible}
                onCancel={() => setWorkerModalVisible(false)}
                onOk={() => {
                    if (selectedWorker) {
                        navigate(`/target/${selectedTarget.id}?worker=${selectedWorker}`)
                    } else {
                        setWorkerModalVisible(false)
                    }
                }}
            >
                <Form>
                    <Form.Item>
                        <Select
                            value={selectedWorker}
                            onChange={(value) => setSelectedWorker(value)}
                        >
                            {workers.map((item) => (
                                <Select.Option value={item.id} key={item.id}>
                                    {item.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default MapContainer
