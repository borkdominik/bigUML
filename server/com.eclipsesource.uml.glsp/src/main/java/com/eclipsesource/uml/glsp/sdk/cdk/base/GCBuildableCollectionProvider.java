/********************************************************************************
 * Copyright (c) 2024 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.sdk.cdk.base;

import java.util.Collection;

import org.eclipse.glsp.graph.GModelElement;

public interface GCBuildableCollectionProvider<TGModel extends GModelElement> extends GCProvider {
   Collection<? extends GCBuildable<TGModel>> provideAll();
}
