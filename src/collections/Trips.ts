import { CollectionConfig } from 'payload'

export const Trips: CollectionConfig = {
  slug: 'trips',
  fields: [
    {
      name: 'anreise_link',
      type: 'text',
      required: true,
    },
    {
      name: 'area',
      type: 'text',
    },
    {
      name: 'beds',
      type: 'number',
      required: true,
    },
    {
      name: 'date_from',
      type: 'date',
      required: true,
    },
    {
      name: 'date_to',
      type: 'date',
      required: true,
    },
    {
      name: 'down_payment',
      type: 'number',
    },
    {
      name: 'final_payment',
      type: 'number',
    },
    {
      name: 'full_payment',
      type: 'number',
    },
    {
      name: 'group_id',
      type: 'relationship',
      relationTo: 'groups',
      required: true,
    },
    {
      name: 'image',
      type: 'text',
      required: true,
    },
    {
      name: 'land',
      type: 'text',
      required: true,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'ort',
      type: 'text',
      required: true,
    },
    {
      name: 'plz',
      type: 'number',
      required: true,
    },
    {
      name: 'rooms',
      type: 'number',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Upcoming', value: 'upcoming' },
        { label: 'Current', value: 'current' },
        { label: 'Done', value: 'done' },
      ],
    },
    {
      name: 'street',
      type: 'text',
      required: true,
    },
    {
      name: 'street_number',
      type: 'number',
      required: true,
    },
  ],
}
