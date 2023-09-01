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
package com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.device;

import org.eclipse.uml2.uml.Device;
import org.eclipse.uml2.uml.UMLFactory;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticChildCommand;
import com.eclipsesource.uml.modelserver.uml.generator.ListNameGenerator;

public class CreateDeviceDeviceSemanticCommand
   extends BaseCreateSemanticChildCommand<Device, Device> {

   public CreateDeviceDeviceSemanticCommand(final ModelContext context, final Device parent) {
      super(context, parent);
   }

   @Override
   protected Device createSemanticElement(final Device parent) {

      var nameGenerator = new ListNameGenerator(Device.class, parent.allNamespaces());

      var deploymentSpecifiaction = UMLFactory.eINSTANCE.createDevice();
      deploymentSpecifiaction.setName(nameGenerator.newName());

      parent.getNestedNodes().add(deploymentSpecifiaction);

      return deploymentSpecifiaction;
   }

}
