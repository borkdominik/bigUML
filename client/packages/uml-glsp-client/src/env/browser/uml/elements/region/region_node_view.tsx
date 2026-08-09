/********************************************************************************
 * Copyright (c) 2021 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
import { injectable } from 'inversify';
import { FrameNodeView } from '../../views/uml-frame.view.js';

/**
 * A region of a state machine or a composite state: the area its states are drawn on.
 *
 * Drawn like the frame that owns it rather than as an ordinary box, because it is the same kind of
 * thing - a boundary the diagram's nodes sit on top of, not a shape of its own. See `FrameNodeView`,
 * which is also where its name tag comes from.
 */
@injectable()
export class RegionNodeView extends FrameNodeView {}
