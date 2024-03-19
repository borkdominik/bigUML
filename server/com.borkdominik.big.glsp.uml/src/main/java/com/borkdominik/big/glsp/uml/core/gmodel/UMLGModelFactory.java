/********************************************************************************
 * Copyright (c) 2024 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.core.gmodel;

import java.util.Collection;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.uml2.uml.Model;

import com.borkdominik.big.glsp.server.core.gmodel.BGEMFGModelFactory;

public class UMLGModelFactory extends BGEMFGModelFactory {
   @Override
   protected Collection<? extends EObject> childrenOf(final EObject semanticModel) {
      var model = (Model) semanticModel;
      return model.getPackagedElements();
   }

}
