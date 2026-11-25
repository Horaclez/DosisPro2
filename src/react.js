import React, { useState, useEffect } from 'react';
import mk from './htm-mini.js';

export { useState, useEffect };
export const html = mk(React.createElement, React.Fragment);
