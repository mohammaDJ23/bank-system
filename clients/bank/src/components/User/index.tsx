import { useEffect, FC } from 'react';
import DefaultContainer from '../../layout/DefaultContainer';
import { useParams } from 'react-router-dom';
import { useAction, useRequest, useSelector } from '../../hooks';
import Skeleton from './Skeleton';
import { UserObj } from '../../lib';
import { UserApi } from '../../apis';
import NotFound from './NotFound';
import Details from './Details';

const UserContent: FC = () => {
  const { request, isInitialApiProcessing } = useRequest();
  const params = useParams();
  const { setSpecificDetails } = useAction();
  const { specificDetails } = useSelector();
  const isUserProcessing = isInitialApiProcessing(UserApi);
  const userId = params.id;
  const user = specificDetails.user;

  useEffect(() => {
    if (userId) {
      request<UserObj, number>(new UserApi(+userId).setInitialApi()).then(response => {
        setSpecificDetails('user', response.data);
      });
    }

    return () => {
      setSpecificDetails('user', null);
    };
  }, []);

  return (
    <DefaultContainer>
      {isUserProcessing ? <Skeleton /> : user ? <Details user={user} /> : <NotFound />}
    </DefaultContainer>
  );
};

export default UserContent;
