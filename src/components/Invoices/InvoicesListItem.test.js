import React from 'react';
import InvoicesListItem from './InvoicesListItem';
import renderer from 'react-test-renderer';

const reservation = {
  comment: 'Ferien über das Wochenende.',
  endDate: '16. März 2019 um 01:00:00 UTC+1',
  numberOfGuests: '4',
  paid: true,
  paidAt: '4. Januar 2019 um 08:14:10 UTC+1',
  rentalId: 'fpNBGYTI4x02EMGSwS3o',
  startDate: '14. März 2019 um 01:00:00 UTC+1',
  userId: 'czKLK5PwLVd5fUucSEHmgHuBt152'
};

const index = 1;

const setMessage = it('renders correctly', () => {
  const tree = renderer
    .create(
      <InvoicesListItem
        reservation={reservation}
        key={index}
        setMessage={this.props.setMessage}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
