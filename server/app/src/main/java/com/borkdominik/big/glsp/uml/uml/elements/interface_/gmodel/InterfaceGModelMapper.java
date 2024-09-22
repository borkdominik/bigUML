/********************************************************************************
 * Copyright (c) 2021-2022 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.uml.elements.interface_.gmodel;

import java.util.Set;

import org.eclipse.emf.common.util.Enumerator;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.uml2.uml.Interface;

import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.server.elements.gmodel.BGEMFElementGModelMapper;
import com.borkdominik.big.glsp.uml.uml.UMLTypes;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public final class InterfaceGModelMapper extends BGEMFElementGModelMapper<Interface, GNode> {

   @Inject
   public InterfaceGModelMapper(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes);
   }

   @Override
   public GNode map(final Interface source) {
      return new GInterfaceBuilder<>(gcmodelContext, source, UMLTypes.INTERFACE.prefix(representation)).buildGModel();
   }
}
