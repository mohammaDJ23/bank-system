import { useEffect, useState } from 'react';
import DefaultContainer from '../../layout/DefaultContainer';
import { useParams } from 'react-router-dom';
import { useRequest } from '../../hooks';
import Skeleton from './Skeleton';
import { UserObj } from '../../lib';
import { Apis, apis } from '../../apis';
import NotFound from './NotFound';
import Details from './Details';

const UserContent = () => {
  const [user, setUser] = useState<UserObj | null>(null);
  const { request, isInitialApiProcessing } = useRequest();
  const params = useParams();
  const isUserProcessing = isInitialApiProcessing(Apis.USER);
  const userId = params.id;

  useEffect(() => {
    if (userId) {
      request<UserObj, number>({
        apiName: Apis.USER,
        data: apis[Apis.USER](+userId),
        config: {
          baseURL: process.env.USER_SERVICE,
        },
        afterRequest(response) {
          setUser(response.data);
        },
      });
    }
  }, []);

  return (
    <DefaultContainer>
      {isUserProcessing ? <Skeleton /> : user ? <Details user={user} /> : <NotFound />}
    </DefaultContainer>
  );
};

export default UserContent;
