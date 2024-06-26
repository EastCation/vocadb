import { SongWithPVAndVoteContract } from '@/types/DataContracts/Song/SongWithPVAndVoteContract';
import { Button, Card, Group, Space, Text } from '@mantine/core';
import Link from 'next/link';
import useStyles from './HighlightedSongCard.styles';
import { IconHeart, IconThumbUp } from '@tabler/icons-react';
import CustomImage from '../Image/Image';
import { getBestThumbImageUrl } from '@/Helpers/getBestThumbUrl';

interface HighlightedSongCardProps {
	song: SongWithPVAndVoteContract;
	priority?: boolean;
}

export function HighlightedSongCard({ song, priority }: HighlightedSongCardProps) {
	const styles = useStyles();

	const bestThumbImageUrl = getBestThumbImageUrl(song.pvs);

	return (
		<Card className={styles.classes.card} radius="md" withBorder shadow="sm">
			<Card.Section>
				<CustomImage
					src={bestThumbImageUrl}
					height={240}
					width={360}
					className={styles.classes.image}
					alt={`${song.name} thumbnail`}
					priority={priority}
				/>
			</Card.Section>
			<div className={styles.classes.textSectionWrapper}>
				<div>
					<Text mt="xs" weight={500}>
						{song.name}
					</Text>
					<Text size="sm" color="dimmed">
						{song.artistString}
					</Text>
				</div>

				<Space h="md" />

				<Group position="apart">
					<Group spacing="xs">
						<>
							<IconThumbUp stroke={'1.5'} size="1.1rem" />

							<Text style={{ stroke: '1.5' }}>
								{(song.ratingScore - 3 * (song.favoritedTimes ?? 0)) / 2}
							</Text>
						</>
						<>
							<IconHeart stroke={'1.5'} size="1.1rem" />
							<Text style={{ stroke: '1.5' }}>{song.favoritedTimes}</Text>
						</>
					</Group>
					<Button
						component={Link}
						href={`/S/${song.id}`}
						variant="outline"
						radius="md"
						title="Song Info"
					>
						Song Info
					</Button>
				</Group>
			</div>
		</Card>
	);
}

