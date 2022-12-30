/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.manifest;

import org.eclipse.emfcloud.modelserver.edit.CommandContribution;

import com.eclipsesource.uml.modelserver.core.manifest.DiagramManifest;
import com.eclipsesource.uml.modelserver.core.manifest.contributions.CommandCodecContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.association.CreateAssociationContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.association.DeleteAssociationContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.data_type.CreateDataTypeContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.data_type.DeleteDataTypeContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.enumeration.CreateEnumerationContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.enumeration.DeleteEnumerationContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.enumeration_literal.CreateEnumerationLiteralContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.enumeration_literal.DeleteEnumerationLiteralContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.generalization.CreateGeneralizationContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.generalization.DeleteGeneralizationContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.operation.CreateOperationContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.operation.DeleteOperationContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.primitive_type.CreatePrimitiveTypeContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.primitive_type.DeletePrimitiveTypeContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.property.CreatePropertyContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.property.DeletePropertyContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.property.UpdatePropertyBoundsContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.property.UpdatePropertyTypeContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.uclass.CreateClassContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.uclass.DeleteClassContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.uinterface.CreateInterfaceContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.uinterface.DeleteInterfaceContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.upackage.CreatePackageContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.upackage.DeletePackageContribution;
import com.google.inject.multibindings.MapBinder;

public final class ClassManifest extends DiagramManifest implements CommandCodecContribution {
   @Override
   protected void configure() {
      super.configure();
      contributeCommandCodec(binder());
   }

   @Override
   public void contributeCommandCodec(final MapBinder<String, CommandContribution> multibinder) {
      // Class
      multibinder.addBinding(CreateClassContribution.TYPE).to(CreateClassContribution.class);
      multibinder.addBinding(DeleteClassContribution.TYPE).to(DeleteClassContribution.class);

      // Property
      multibinder.addBinding(CreatePropertyContribution.TYPE).to(CreatePropertyContribution.class);
      multibinder.addBinding(DeletePropertyContribution.TYPE).to(DeletePropertyContribution.class);
      multibinder.addBinding(UpdatePropertyTypeContribution.TYPE).to(UpdatePropertyTypeContribution.class);
      multibinder.addBinding(UpdatePropertyBoundsContribution.TYPE).to(UpdatePropertyBoundsContribution.class);

      // Association
      multibinder.addBinding(CreateAssociationContribution.TYPE).to(CreateAssociationContribution.class);
      multibinder.addBinding(DeleteAssociationContribution.TYPE).to(DeleteAssociationContribution.class);

      // Generalization
      multibinder.addBinding(CreateGeneralizationContribution.TYPE).to(CreateGeneralizationContribution.class);
      multibinder.addBinding(DeleteGeneralizationContribution.TYPE).to(DeleteGeneralizationContribution.class);

      // Interface
      multibinder.addBinding(CreateInterfaceContribution.TYPE).to(CreateInterfaceContribution.class);
      multibinder.addBinding(DeleteInterfaceContribution.TYPE).to(DeleteInterfaceContribution.class);

      // Enumeration
      multibinder.addBinding(CreateEnumerationContribution.TYPE).to(CreateEnumerationContribution.class);
      multibinder.addBinding(DeleteEnumerationContribution.TYPE).to(DeleteEnumerationContribution.class);

      // Enumeration Literal
      multibinder.addBinding(CreateEnumerationLiteralContribution.TYPE).to(CreateEnumerationLiteralContribution.class);
      multibinder.addBinding(DeleteEnumerationLiteralContribution.TYPE).to(DeleteEnumerationLiteralContribution.class);

      // Operation
      multibinder.addBinding(CreateOperationContribution.TYPE).to(CreateOperationContribution.class);
      multibinder.addBinding(DeleteOperationContribution.TYPE).to(DeleteOperationContribution.class);

      // Data Type
      multibinder.addBinding(CreateDataTypeContribution.TYPE).to(CreateDataTypeContribution.class);
      multibinder.addBinding(DeleteDataTypeContribution.TYPE).to(DeleteDataTypeContribution.class);

      // Data Type
      multibinder.addBinding(CreatePrimitiveTypeContribution.TYPE).to(CreatePrimitiveTypeContribution.class);
      multibinder.addBinding(DeletePrimitiveTypeContribution.TYPE).to(DeletePrimitiveTypeContribution.class);

      // Package
      multibinder.addBinding(CreatePackageContribution.TYPE).to(CreatePackageContribution.class);
      multibinder.addBinding(DeletePackageContribution.TYPE).to(DeletePackageContribution.class);

   }
}
