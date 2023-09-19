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
package com.eclipsesource.uml.glsp.uml.elements.information_flow;

import org.eclipse.uml2.uml.Classifier;
import org.eclipse.uml2.uml.InformationFlow;

import com.eclipsesource.uml.glsp.uml.configuration.ElementConfigurationRegistry;
import com.eclipsesource.uml.glsp.uml.handler.element.EdgeOperationHandler;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class InformationFlowOperationHandler extends EdgeOperationHandler<InformationFlow, Classifier, Classifier> {

   @Inject
   public InformationFlowOperationHandler(@Assisted final Representation representation,
      final ElementConfigurationRegistry registry) {
      super(representation, registry.accessTyped(representation, InformationFlow.class).typeId());
   }
}
