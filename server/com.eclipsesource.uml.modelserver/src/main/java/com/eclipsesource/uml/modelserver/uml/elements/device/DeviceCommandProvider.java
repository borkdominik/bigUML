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
package com.eclipsesource.uml.modelserver.uml.elements.device;

import java.util.Collection;
import java.util.List;

import org.eclipse.emf.common.command.Command;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.uml2.uml.Device;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.Node;
import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.UMLFactory;

import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.AddShapeNotationCommand;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticChildCommand;
import com.eclipsesource.uml.modelserver.uml.command.provider.element.NodeCommandProvider;
import com.eclipsesource.uml.modelserver.uml.elements.class_.commands.AddNestedClassifierSemanticCommand;
import com.eclipsesource.uml.modelserver.uml.elements.device.commands.UpdateDeviceArgument;
import com.eclipsesource.uml.modelserver.uml.elements.device.commands.UpdateDeviceSemanticCommand;
import com.eclipsesource.uml.modelserver.uml.elements.packageable_element.AddPackagedElementCommand;

public class DeviceCommandProvider extends NodeCommandProvider<Device, Element> {

   @Override
   protected Collection<Command> createModifications(final ModelContext context, final Element parent,
      final GPoint position) {
      BaseCreateSemanticChildCommand<?, ?> semantic = null;
      if (parent instanceof Package) {
         semantic = new AddPackagedElementCommand(context, (Package) parent, p -> {
            return UMLFactory.eINSTANCE.createDevice();
         });
      } else if (parent instanceof Node) {
         semantic = new AddNestedClassifierSemanticCommand(context, (Node) parent, p -> {
            return UMLFactory.eINSTANCE.createDevice();
         });
      } else {
         throw new IllegalArgumentException(String.format("Parent %s can not be handled", parent.getClass().getName()));
      }

      var notation = new AddShapeNotationCommand(
         context, semantic::getSemanticElement, position, GraphUtil.dimension(160, 50));
      return List.of(semantic, notation);
   }

   @Override
   protected Collection<Command> updateModifications(final ModelContext context, final Device element) {
      var decoder = new ContributionDecoder(context);
      var update = decoder.embedJson(UpdateDeviceArgument.class);
      return List.of(new UpdateDeviceSemanticCommand(context, element, update));
   }

}
