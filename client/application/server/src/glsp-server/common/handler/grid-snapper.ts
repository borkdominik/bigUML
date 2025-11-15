/********************************************************************************
 * Copyright (c) 2022-2023 STMicroelectronics and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import { Point } from '@eclipse-glsp/server';

export class GridSnapper {
    public static GRID_X = 10.0;
    public static GRID_Y = 10.0;

    public static snap(originalPoint: Point | undefined): Point | undefined {
        if (originalPoint) {
            return {
                x: Math.round(originalPoint.x / this.GRID_X) * this.GRID_X,
                y: Math.round(originalPoint.y / this.GRID_Y) * this.GRID_Y
            };
        } else {
            return undefined;
        }
    }
}
