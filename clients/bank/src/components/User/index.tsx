import { useEffect, FC } from 'react';
import DefaultContainer from '../../layout/DefaultContainer';
import { useParams } from 'react-router-dom';
import { useAction, useRequest, useSelector } from '../../hooks';
import Skeleton from './Skeleton';
import { UserObj, UserWithBillInfoObj } from '../../lib';
import { UserWithBillInfoApi } from '../../apis';
import NotFound from './NotFound';
import Details from './Details';

const UserContent: FC = () => {
  const { request, isInitialApiProcessing } = useRequest();
  const params = useParams();
  const { setSpecificDetails } = useAction();
  const { specificDetails } = useSelector();
  const isUserProcessing = isInitialApiProcessing(UserWithBillInfoApi);
  const userId = params.id;
  const user = specificDetails.userWithBillInfo;

  useEffect(() => {
    if (userId) {
      request<UserWithBillInfoObj, number>(new UserWithBillInfoApi(+userId).setInitialApi()).then(response => {
        setSpecificDetails('userWithBillInfo', response.data);
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
