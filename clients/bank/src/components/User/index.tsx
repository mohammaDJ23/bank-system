import { useEffect, FC } from 'react';
import DefaultContainer from '../../layout/DefaultContainer';
import { useParams } from 'react-router-dom';
import { useAction, useRequest, useSelector } from '../../hooks';
import Skeleton from './Skeleton';
import { UserWithBillInfoObj } from '../../lib';
import { UserWithBillInfoApi } from '../../apis';
import NotFound from './NotFound';
import Details from './Details';
import Navigation from '../../layout/Navigation';

const UserContent: FC = () => {
  const { request, isInitialApiProcessing } = useRequest();
  const params = useParams();
  const { setSpecificDetails } = useAction();
  const { specificDetails } = useSelector();
  const isUserWithBillInfoApiProcessing = isInitialApiProcessing(UserWithBillInfoApi);
  const user = specificDetails.userWithBillInfo;

  useEffect(() => {
    const userId = params.id;
    if (userId) {
      request<UserWithBillInfoObj, number>(new UserWithBillInfoApi(+userId).setInitialApi()).then(response => {
        setSpecificDetails('userWithBillInfo', response.data);
      });
    }
  }, []);

  return (
    <Navigation>
      <DefaultContainer>
        {isUserWithBillInfoApiProcessing ? <Skeleton /> : user ? <Details user={user} /> : <NotFound />}
      </DefaultContainer>
    </Navigation>
  );
};

export default UserContent;
