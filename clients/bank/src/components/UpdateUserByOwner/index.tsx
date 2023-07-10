import FormContainer from '../../layout/FormContainer';
import Form from './Form';
import { UpdateUserByOwner, UserObj } from '../../lib';
import { useAction, useForm, useRequest, useSelector } from '../../hooks';
import { useEffect, FC } from 'react';
import { useParams } from 'react-router-dom';
import Skeleton from './Skeleton';
import { UserApi } from '../../apis';
import NotFound from './NotFound';
import Navigation from '../../layout/Navigation';

const UpdateUserByOwnerContent: FC = () => {
  const params = useParams();
  const { setSpecificDetails } = useAction();
  const { specificDetails } = useSelector();
  const { request, isInitialApiProcessing } = useRequest();
  const updateUserByOwnerFormInstance = useForm(UpdateUserByOwner);
  const isInitialUserApiProcessing = isInitialApiProcessing(UserApi);

  useEffect(() => {
    const userId = params.id;
    if (userId) {
      request<UserObj, number>(new UserApi(+userId).setInitialApi()).then(response => {
        setSpecificDetails('user', response.data);
        updateUserByOwnerFormInstance.initializeForm(
          new UpdateUserByOwner({
            id: response.data.id,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
            phone: response.data.phone,
            role: response.data.role,
          })
        );
      });
    }
  }, []);

  return (
    <Navigation>
      <FormContainer>
        {isInitialUserApiProcessing ? (
          <Skeleton />
        ) : specificDetails.user ? (
          <Form formInstance={updateUserByOwnerFormInstance} />
        ) : (
          <NotFound />
        )}
      </FormContainer>
    </Navigation>
  );
};

export default UpdateUserByOwnerContent;
