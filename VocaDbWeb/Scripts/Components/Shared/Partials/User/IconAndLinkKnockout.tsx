import { ProfileIconKnockout_ImageSize } from '@/Components/Shared/Partials/User/ProfileIconKnockout_ImageSize';
import { UserApiContract } from '@/DataContracts/User/UserApiContract';
import { ImageSize } from '@/Models/Images/ImageSize';
import { EntryUrlMapper } from '@/Shared/EntryUrlMapper';
import React from 'react';
import { Link } from 'react-router-dom';

interface IconAndLinkKnockoutProps {
	user: UserApiContract;
}

// User icon inside anchor (no name)
export const IconAndLinkKnockout = React.memo(
	({ user }: IconAndLinkKnockoutProps): React.ReactElement => {
		return (
			<Link
				to={EntryUrlMapper.details_user_byName(user.name)}
				className="pull-left"
			>
				{/* eslint-disable-next-line react/jsx-pascal-case */}
				<ProfileIconKnockout_ImageSize
					imageSize={ImageSize.Thumb}
					user={user}
					size={70}
				/>
			</Link>
		);
	},
);
