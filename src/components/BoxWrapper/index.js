import { ProfileRelationsBoxWrapper } from '../ProfileRelations';

const BoxWrapper = (props) => {
    return (
        <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
                {props.title} ({props.item?.length})
            </h2>
            <ul>
                {props.item?.slice(0, 6).map((item, index) => {
                return (
                    <li key={index}>
                        <a>
                            <img src={item?.image} style={{ borderRadius: '8px' }}/>
                            <span>{item.name ? item.name : item.title}</span>
                        </a>
                    </li>
                )
                })
                }
            </ul>
        </ProfileRelationsBoxWrapper>
    )
}


export default BoxWrapper;