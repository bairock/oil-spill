import { Button } from 'antd'
import { Top } from "../components"
import WorkersContainer from '../containers/Workers'

const Workers = () => {
    return (
        <>
            <Top
                title="Список сотрудников"
                action={
                    <Button onClick={() => { }} type="link">
                        Добавить сотрудника
                    </Button>
                }
            />
            <WorkersContainer />
        </>
    )
}

export default Workers