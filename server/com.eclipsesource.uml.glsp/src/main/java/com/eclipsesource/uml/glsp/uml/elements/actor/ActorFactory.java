/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.elements.actor;

import com.eclipsesource.uml.glsp.uml.elements.actor.features.ActorLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.elements.actor.features.ActorPropertyMapper;
import com.eclipsesource.uml.glsp.uml.elements.actor.gmodel.ActorNodeMapper;
import com.eclipsesource.uml.glsp.uml.manifest.node.NodeFactory;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public interface ActorFactory extends NodeFactory {
   @Override
   ActorConfiguration nodeConfiguration(Representation representation);

   @Override
   ActorNodeMapper gmodel(Representation representation);

   @Override
   ActorOperationHandler nodeOperationHandler(Representation representation);

   @Override
   ActorLabelEditMapper labelEditMapper(Representation representation);

   @Override
   ActorPropertyMapper elementPropertyMapper(Representation representation);
}
