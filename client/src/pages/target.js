import React from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { Button, Spin } from 'antd'
import styled from 'styled-components'
import ReactToPdf from 'react-to-pdf'

import { FIND_UNIQUE_TARGET } from '../gqls'
import { Label } from '../components'
import { FIND_UNIQUE_WORKER } from '../gqls/worker'
import moment from 'moment'

const Title = styled.div`
    font-size: 30px;
    margin-bottom: 15px;
`

const SubTitle = styled.div`
    font-size: 20px;
    font-weight: 300;
    margin-bottom: 10px;
`

const Images = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    img {
        height: 200px;
        margin-right: 10px;
        margin-bottom: 10px;
    }
`

function useQueryParams() {
    const { search } = useLocation()

    return React.useMemo(() => new URLSearchParams(search), [search])
}

const Target = ({ ...props }) => {
    const { id } = useParams()
    const query = useQueryParams()

    const workerId = query.get('worker')

    const { data, loading } = useQuery(FIND_UNIQUE_TARGET, {
        fetchPolicy: 'network-only',
        variables: { where: { id } }
    })

    const { data: workerData, loading: workerLoading } = useQuery(FIND_UNIQUE_WORKER, {
        variables: { where: { id: workerId } }
    })

    const target = data?.findUniqueTarget
    const worker = workerData?.findUniqueWorker

    if (loading || workerLoading) return <Spin />

    let foundDate
    let foundImage
    foundImage = target.images.find((item) => item.status === 2)

    if (!foundImage) {
        foundImage = target.images[0]
    }
    if (foundImage) {
        foundDate = moment(foundImage.date)
    }

    return (
        <ReactToPdf scale={0.8}>
            {({ toPdf, targetRef }) => {
                return (
                    <>
                        <div style={{ padding: 15 }} ref={targetRef}>
                            <Title>Отчет № {new Date().getTime()}</Title>
                            <Label
                                label="Дата обнаружения"
                                value={foundDate ? foundDate.format('DD.MM.YYYY HH:mm') : '-'}
                            />
                            <Label
                                label="Площадь загрязненного участка (га)"
                                value={foundImage ? '0,0368 + 0,0166' : '0'}
                            />
                            <SubTitle>Координаты</SubTitle>
                            <Label label="Долгота" value={target.longitude} />
                            <Label label="Широта" value={target.latitude} />
                            <SubTitle>Объект</SubTitle>
                            <Label label="Название объекта" value={target.name} />
                            <Label
                                label="Дата регистрации"
                                value={moment(target.createdAt).format('DD.MM.YYYY HH:mm')}
                            />
                            <Label label="Специалист" value={worker.name} />
                            <Label label="Категория земель" value={'Земли лесного фонда'} />
                            <SubTitle>Фотографии</SubTitle>
                            <Images>
                                {target.images.map((item) => {
                                    // eslint-disable-next-line jsx-a11y/alt-text
                                    return <img src={`/uploads/${item.name}`} key={item.id} />
                                })}
                            </Images>
                        </div>

                        <div style={{ padding: 15 }}>
                            <Button onClick={toPdf} type="primary">
                                Скачать
                            </Button>
                        </div>
                    </>
                )
            }}
        </ReactToPdf>
    )
}

export default Target
